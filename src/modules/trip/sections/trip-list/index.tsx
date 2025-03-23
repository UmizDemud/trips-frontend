"use client"


import { useEffect, useState } from "react";
import Link from "next/link";


import type { Trip } from "@/modules/trip/types/trip";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  capitalizeWords,
  metersToDistanceString,
  secondsToDurationString,
} from "@/lib/utils";

import { LocalTimeDisplay } from "@/components/local-time-display";



export const TripList = () => {
  const [trips, setTrips] = useState<Trip[]>([]);


  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip")
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return []
      })
      .then((res) => {
        setTrips(res);
      })
      .catch(console.error)
  })

  return (
    <Table className="orient-table">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[unset] md:min-w-[10rem]">Start Time</TableHead>
            <TableHead className="min-w-[unset] md:min-w-[10rem]">
              <div className="flex flex-col justify-center items-center">
                <p className="md:block hidden">Stop #</p>
                <p>Distance</p>
              </div>
            </TableHead>
            <TableHead className="min-w-[unset] md:min-w-[10rem]" colSpan={100}>Stops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.length != 0 ? (
            trips.map(trip => {
              const tripDate = new Date(trip.created_at ?? trip.start_date);
  
              return (
                <Link className="cursor-pointer" key={trip.id} href={`trip/visualize/${trip.id}`} legacyBehavior={true}>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <div>
                        <LocalTimeDisplay date={tripDate} datetime="time" />
                      </div>
  
                      <div>
                        <LocalTimeDisplay date={tripDate} datetime="date" />
                      </div>
                    </TableCell>
  
                    <TableCell>
                      <div className="flex flex-col justify-center items-center">
                        <p className="md:block hidden">{trip.locations.length} stops</p>
                        <p>{metersToDistanceString(trip.locations[trip.locations.length - 1].distance ?? 0)}</p>
                      </div>
                    </TableCell>
  
                    {trip.locations.map((l, i: number) => (
                      <TableCell className="hidden md:table-cell" key={`${i}_${l.name}`}>
                        <div className="md:w-40">
                          <div >
                            <div className="overflow-ellipsis overflow-hidden">{capitalizeWords(l.type)}</div>
  
                            <div className="overflow-ellipsis overflow-hidden">{l.name}</div>
  
                            <div className="overflow-ellipsis overflow-hidden">{l.distance ? metersToDistanceString(l.distance) : "-"}</div>
  
                            <div className="overflow-ellipsis overflow-hidden">{l.time ? secondsToDurationString(l.time) : "-"}</div>
                          </div>
                        </div>
                      </TableCell>
                    ))}
  
                    <TableCell className="block md:hidden">
                      <div>{trip.locations.length} stops</div>
                      <div className="flex">
                        <p className="w-16">Curent:</p>
                        <p className="w-32 whitespace-nowrap overflow-hidden text-ellipsis">{trip.locations.find(el => el.type === "current")?.name ?? "-"}</p>
                      </div>
                      <div className="flex">
                        <p className="w-16">Pickup:</p>
                        <p className="w-32 whitespace-nowrap overflow-hidden text-ellipsis">{trip.locations.find(el => el.type === "pickup")?.name ?? "-"}</p>
                      </div>
                      <div className="flex">
                        <p className="w-16">Dropoff:</p>
                        <p className="w-32 whitespace-nowrap overflow-hidden text-ellipsis">{trip.locations.find(el => el.type === "dropoff")?.name ?? "-"}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </Link>
              )
            })
          ) : (
            <>Loading...</>
          )}
        </TableBody>
      </Table>
  )
}
