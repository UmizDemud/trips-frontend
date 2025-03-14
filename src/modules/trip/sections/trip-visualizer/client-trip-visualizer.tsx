"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { cn } from '@/lib/utils';
import { Location, Trip } from '../../types/trip';


const MapInteraction = ({minmax}: {
  minmax: [[number,number], [number,number]]
}) => {
  const center: [number, number] = [
    (minmax[0][0] + minmax[0][1]) / 2,
    (minmax[1][0] + minmax[1][1]) / 2,
  ]

  const map = useMap();
  const zoom = map.getBoundsZoom(minmax);

  map.setView(center, zoom)

  return null
}


export default function ClientTripVisualizer({trip}: {
  trip: Trip
}) {

  const [error, setError] = useState("")
  const [driveRoute, setDriveRoute] = useState<[number, number][] | null>(null);

  const { locations } = trip;

  const generateDriveRoute = async (stops: Location[], route: [number, number][]): Promise<[number, number][] | null> => {

    let _route = [...route];
    let target = 1;

    while (target < stops.length) {

      const data = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${stops[target - 1].latitude}%2C${stops[target - 1].longitude}%7C${stops[target].latitude}%2C${stops[target].longitude}&mode=drive&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`)
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            setError("Locations are in unconnected regions.");

            return null;
          }

          return res.features[0].geometry.coordinates[0]
        })
        .catch(e => console.error(e));
      
      if (!data) {
        return null;
      }

      _route = [..._route, ...data.map(([a, b]: [number, number]) => ([b, a]))];
      target += 1;
    }

    return _route
  }


  useEffect(() => {
    setError("")

    generateDriveRoute(locations, [])
      .then(route => {
        if (route) {
          setDriveRoute(route)
        }
      })

  }, [locations]);

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

  
  return (
    <div className='relative overflow-hidden rounded-4xl'>
      <MapContainer
        className='w-96 h-96 md:w-[64rem] md:h-[48rem]'
        center={[0, 0]}
        zoom={12}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations && locations.map((stop, i) => (
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
        ))}

        {driveRoute != null && <Polyline positions={driveRoute} color="blue" />}

        <MapInteraction minmax={minmax} />
      </MapContainer>

      {error && (
        <div className='absolute right-2 bottom-2 p-4 rounded bg-red-800 text-white flex justify-center items-center z-100000'>
          {error}
        </div>
      )}
    </div>
  )
}
