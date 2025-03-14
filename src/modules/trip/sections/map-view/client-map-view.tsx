
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvent, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { Address } from '@/app/trip/new/page';
import type { TripRoute } from '../../types/trip-route';
import { cn, getDistance, getFuelStops } from '@/lib/utils';
import { Location } from '../../types/trip';

type TripData = {
  current?: Address;
  pickup?: Address;
  dropoff?: Address;
}

const MapInteraction = ({locations}: {
  locations: Location[]
}) => {
  const map = useMap();

  useEffect(() => {
    if (!locations.length) return;

    const minmax:[[number,number],[number,number]] = locations.reduce((acc, cur) => {
      return [
        [
          Math.min(acc[0][0], cur.latitude),
          Math.max(acc[0][1], cur.latitude),
        ],
        [
          Math.min(acc[1][0], cur.longitude),
          Math.max(acc[1][1], cur.longitude),
        ]
      ]
    }, [[Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER], [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]])
  
    const center: [number, number] = [
      (minmax[0][0] + minmax[0][1]) / 2,
      (minmax[1][0] + minmax[1][1]) / 2,
    ]
  
    const zoom = map.getBoundsZoom(minmax);
  
    map.setView(center, zoom)
  }, [locations])

  return null
}


function SetViewOnClick({tripData, currentCenter}: {tripData: TripData, currentCenter?: [number, number]}) {

  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), { animate: true, duration: 2 })})

  useEffect(() => {
    if (!currentCenter) return

    map.setView([currentCenter[0], currentCenter[1]], map.getZoom(), { animate: true, duration: 2 })
  }, [currentCenter])

  useEffect(() => {
    if (!tripData?.current) return

    map.setView([parseFloat(tripData.current.latitude ?? "0"), parseFloat(tripData.current.longitude ?? "0")], map.getZoom(), { animate: true, duration: 2 })
  }, [tripData.current])

  useEffect(() => {
    if (!tripData?.pickup) return

    map.setView([parseFloat(tripData.pickup.latitude ?? "0"), parseFloat(tripData.pickup.longitude ?? "0")], map.getZoom(), { animate: true, duration: 2 })
  }, [tripData.pickup])

  useEffect(() => {
    if (!tripData?.dropoff) return

    map.setView([parseFloat(tripData.dropoff.latitude ?? "0"), parseFloat(tripData.dropoff.longitude ?? "0")], map.getZoom(), { animate: true, duration: 2 })
  }, [tripData.dropoff])

  return null
}

export default function MapView({tripData, stops, setStops, loading, setLoading}: {
  tripData: TripData,
  stops: Location[],
  setStops: (newStops: Location[]) => void
  loading: boolean
  setLoading: (val: boolean) => void
}) {

  const [driveRoute, setDriveRoute] = useState<[number, number][] | null>(null)
  const [error, setError] = useState("");
  const [progression, setProgression] = useState("")
  const [currentCenter, setCurrentCenter] = useState<[number, number] | undefined>()

  const tripComplete = tripData.current && tripData.pickup && tripData.dropoff;


  const getFuelStop = async (loc: [number, number], rad: number): Promise<{
    location: [number, number],
    name: string,
  } | null> => {

    const data: {
      location: [number, number], // longitude, latitude
      name: string
    }[] = await getFuelStops(...loc, rad)

    if (data.length < 1) {
      return null;
    }

    return data[0]

  }

  const generateDriveRoute = async (): Promise<{
    stops: Location[],
    route: [number, number][]
  } | null> => {

    if (!tripData.current || !tripData.pickup || !tripData.dropoff) return null

    let _stops: Location[] = [{
      latitude: parseFloat(tripData.current.latitude),
      longitude: parseFloat(tripData.current.longitude),
      type: "current",
      name: tripData.current.address || "Start Location"
    }, {
      latitude: parseFloat(tripData.pickup.latitude),
      longitude: parseFloat(tripData.pickup.longitude),
      type: "pickup",
      name: tripData.pickup.address || "Pickup Location"
    }, {
      latitude: parseFloat(tripData.dropoff.latitude),
      longitude: parseFloat(tripData.dropoff.longitude),
      type: "dropoff",
      name: tripData.dropoff.address || "Dropoff Location"
    }];

    let _route: [number, number][] = [];

    let target = 1;
    let cumDist = 0;
    let roadDist = 0;
    let roadTime = 0;
    
    while (target < _stops.length) {
      setProgression(`Routing to ${_stops[target].name}`)

      const data = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${_stops[target - 1].latitude}%2C${_stops[target - 1].longitude}%7C${_stops[target].latitude}%2C${_stops[target].longitude}&mode=drive&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            setError("Locations are in unconnected regions.");

            return null;
          }

          return res.features[0]
        })
        .catch(e => console.error(e));
      
      if (!data) {
        return null;
      }

      const stopCoordinates = data.geometry.coordinates[0]


      for (let i = 1; i < stopCoordinates.length; i++) {

        cumDist += getDistance(stopCoordinates[i - 1], stopCoordinates[i]);

        if (cumDist > 900) {
          setProgression(`Adding a fuel stop`)

          let routePoint
          let fuelStopData
          let j = 0;
          let rad = 10000

          while (!fuelStopData) {
            routePoint = null
            while (!routePoint) {
              routePoint = await getFuelStop([stopCoordinates[i - j][1], stopCoordinates[i - j][0]], rad);
              if (j % 20 === 0) {
                rad += 10000
              } else {
                j += 10
              }
            }

            fuelStopData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${_stops[target - 1].latitude}%2C${_stops[target - 1].longitude}%7C${routePoint.location[1]}%2C${routePoint.location[0]}&mode=drive&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
              .then(res => res.json())
              .then(res => {
                if (res.error) {
                  setError("Locations are in unconnected regions.");

                  return null;
                }

                return res.features[0]
              })
              .catch(e => console.error(e));
          }


          _stops = [
            ..._stops.slice(0, target),
            {
              latitude: routePoint?.location[1] || 0,
              longitude: routePoint?.location[0] || 0,
              type: "fuel",
              name: routePoint?.name || "",
            },
            ..._stops.slice(target)
          ]

          const fuelstopCoordinates = fuelStopData.geometry.coordinates[0];

          roadDist += fuelStopData.properties.distance;
          roadTime += fuelStopData.properties.time;

          _stops[target].time = roadTime;
          _stops[target].distance = roadDist;

          _route = [..._route, ...fuelstopCoordinates.map(([a, b]: [number, number]) => ([b, a]))];
          cumDist = 0;
          break;
        }
      }

      if (cumDist !== 0) {
        roadDist += data.properties.distance;
        roadTime += data.properties.time;

        _stops[target].time = roadTime;
        _stops[target].distance = roadDist;

        _route = [..._route, ...stopCoordinates.map(([a, b]: [number, number]) => ([b, a]))];
      }

      if (target !== _stops.length - 1) {
        setCurrentCenter([_stops[target].latitude, _stops[target].longitude])
      }
      target += 1;
    }

    return {
      stops: _stops,
      route: _route,
    }
  }


  useEffect(() => {
    if (
      !tripData.current?.latitude ||
      !tripData.current?.longitude ||
      !tripData.pickup?.latitude ||
      !tripData.pickup?.longitude ||
      !tripData.dropoff?.latitude ||
      !tripData.dropoff?.longitude
    ) return

    setError("")
    setLoading(true);

    generateDriveRoute()
      .then(route => {
        if (route) {
          setDriveRoute(route.route)
          setStops(route.stops)
        }
      }).finally(() => {
        setLoading(false)
        setProgression("")
      });

  }, [tripData, tripComplete]);


  return (
    <div className='relative overflow-hidden rounded-4xl'>
      <MapContainer
        className='w-96 h-96 md:w-[64rem] md:h-[48rem]'
        center={[parseFloat(tripData.pickup?.latitude || "0"), parseFloat(tripData.current?.longitude || "0")]}
        zoom={4}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stops
          ? stops.map((stop, i) => (
            <Marker key={`marker_${i}`} icon={L.divIcon({
              iconSize: [60, 60],
              iconAnchor: stop.type === "fuel" ? [60 / 2 + 9, 20] : [60 / 2 + 9, 60 + 9],
              className: cn(stop.type === "fuel" ? "text-3xl" : "text-6xl"),
              html: stop.type === "fuel" ? "⛽" : "📍",
            })} position={[stop.latitude, stop.longitude]}>
              <Popup>
                {stop.name}
              </Popup>
            </Marker>
          ))
          : <>
            {(tripData.current?.latitude && tripData.current?.longitude) && (
              <Marker icon={L.divIcon({
                iconSize: [60, 60],
                iconAnchor: [60 / 2 + 9, 60 + 9],
                className: "text-6xl",
                html: "📍",
              })} position={[parseFloat(tripData.current?.latitude), parseFloat(tripData.current?.longitude)]}>
                <Popup>
                  {stop.name}
                </Popup>
              </Marker>
            )}

            {(tripData.pickup?.latitude && tripData.pickup?.longitude) && (
              <Marker icon={L.divIcon({
                iconSize: [60, 60],
                iconAnchor: [60 / 2 + 9, 60 + 9],
                className: "text-6xl",
                html: "📍",
              })} position={[parseFloat(tripData.pickup?.latitude), parseFloat(tripData.pickup?.longitude)]}>
                <Popup>
                  {stop.name}
                </Popup>
              </Marker>
            )}

            {(tripData.dropoff?.latitude && tripData.dropoff?.longitude) && (
              <Marker icon={L.divIcon({
                iconSize: [60, 60],
                iconAnchor: [60 / 2 + 9, 60 + 9],
                className: "text-6xl",
                html: "📍",
              })} position={[parseFloat(tripData.dropoff?.latitude), parseFloat(tripData.dropoff?.longitude)]}>
                <Popup>
                  {stop.name}
                </Popup>
              </Marker>
            )}
        </>}

        {driveRoute != null && <Polyline positions={driveRoute as TripRoute} color="blue" />}

        <MapInteraction locations={stops} />
        <SetViewOnClick currentCenter={currentCenter} tripData={tripData}/>
      </MapContainer>

      {(!error && loading) && (
        <div className='absolute inset-0 flex justify-center bg-neutral-800/40 items-center z-100000'>
          <Loader2Icon className='animate-spin'/>

          {(progression) && (
            <div className='absolute right-2 bottom-2 p-4 rounded bg-neutral-800/80 text-white flex justify-center items-center z-100000'>
              {progression}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className='absolute right-2 bottom-2 p-4 rounded bg-red-800 text-white flex justify-center items-center z-100000'>
          {error}
        </div>
      )}
    </div>
  )
}
