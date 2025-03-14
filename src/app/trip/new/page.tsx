"use client"

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation"

import type { Location } from "@/modules/trip/types/trip";

import { LocationPicker } from "@/modules/trip/sections/location-picker";
import { MapView } from "@/modules/trip/sections/map-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type Address = {
  latitude: string,
  longitude: string,
  address: string
}

export default function LogbookNew() {
  const [searchLocation, setSearchLocation] = useState<{
    current?: Address,
    pickup?: Address,
    dropoff?: Address
  }>({});
  const router = useRouter();  

  const hrsRef = useRef<HTMLInputElement | null>(null);
  const [stops, setStops] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");

  const handleChangeLocation = (
    name: "address" | "latitude" | "longitude",
    value: string,
    stop: "current" | "pickup" | "dropoff"
  ) => {

    setSearchLocation(prev => ({
      ...prev,
      [stop]: {
        ...prev[stop],
        [name]: value
      }
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = new Date();

    if (!stops.length) return;
    if (!hrsRef.current?.value) {
      setError("Please enter CCU(hours)")
      return;
    }

    setLoading(true)

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/trip", {
      method: "POST",
      body: JSON.stringify({
        "locations": stops,
        "cycle_hours": hrsRef.current?.value,
        "start_date": now.toISOString(),
      })
    })
    .then(res => res.json())
    .then(res => {

      if (res.id) {
        router.push("/trip/visualize/" + res.id)
      }

    })
    .catch(console.error)
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="flex justify-between">
      <div className="p-2 text-neutral-900 w-96 dark:text-neutral-100">
        <h1 className="w-64 px-4 pt-2 text-2xl font-bold border-b-2 border-neutral-600 dark:border-neutral-400">
          New Trip
        </h1>

        <form onSubmit={e => handleSubmit(e)} className="flex flex-col p-4 gap-6">
          <LocationPicker
            title="Current"
            setAddress={(val: string) => handleChangeLocation("address", val, "current")}
            setLatitude={(val: string) => handleChangeLocation("latitude", val, "current")}
            setLongitude={(val: string) => handleChangeLocation("longitude", val, "current")}
            accepted={!!searchLocation.current?.latitude && !!searchLocation.current.longitude}
          />

          <LocationPicker
            title="Pickup"
            setAddress={(val: string) => handleChangeLocation("address", val, "pickup")}
            setLatitude={(val: string) => handleChangeLocation("latitude", val, "pickup")}
            setLongitude={(val: string) => handleChangeLocation("longitude", val, "pickup")}
            accepted={!!searchLocation.pickup?.latitude && !!searchLocation.pickup.longitude}
          />

          <LocationPicker
            title="Dropoff"
            setAddress={(val: string) => handleChangeLocation("address", val, "dropoff")}
            setLatitude={(val: string) => handleChangeLocation("latitude", val, "dropoff")}
            setLongitude={(val: string) => handleChangeLocation("longitude", val, "dropoff")}
            accepted={!!searchLocation.dropoff?.latitude && !!searchLocation.dropoff.longitude}
          />

          <div>
            <h2 className="text-lg font-bold mb-2">■ Current Cycle Used (Hrs)</h2>

            <div className="flex items-center gap-2">
              <Input ref={hrsRef} type="number" className="block w-48" />

              <div className="h-6 w-6"></div>
            </div>
          </div>

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          <Button disabled={loading || stops.length === 0 || !searchLocation.current || !searchLocation.pickup || !searchLocation.dropoff} className={cn("cursor-pointer", loading && "bg-neutral-600")}>Save</Button>
        </form>
      </div>

      <div className="ml-4 pl-10 py-2 border-l-2 border-neutral-400">
        <MapView
          stops={stops}
          tripData={searchLocation}
          setStops={(val: Location[]) => setStops(val)}
          loading={loading}
          setLoading={(val: boolean) => setLoading(val)}
        />
      </div>
    </div>
  )
}