import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalizeWords, metersToDistanceString, secondsToDurationString } from "@/lib/utils";
import { Location, Trip } from "@/modules/trip/types/trip";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const data: Trip[] = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip")
    .then(res => res.json())
    .catch(console.error)

  if (!data) return

  return (
    <div className="overflow-scroll-x">
      <h1 className="w-64 px-4 pt-2 mb-12 text-2xl font-bold border-b-2 border-neutral-600 dark:border-neutral-400">
        Trips
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[10rem]">Start Time</TableHead>
            <TableHead className="min-w-[10rem]">
              <div className="flex flex-col justify-center items-center">
                <p>Stop #</p>
                <p>Distance</p>
              </div>
            </TableHead>
            <TableHead className="min-w-[10rem]" colSpan={100}>Stops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(trip => {
            const tripDate = new Date(trip.start_date);

            return (
              <Link className="cursor-pointer" key={trip.id} href={`trip/visualize/${trip.id}`} legacyBehavior={true}>
                <TableRow className="cursor-pointer">
                  <TableCell>
                    <div>
                      {tripDate.toLocaleTimeString()}
                    </div>

                    <div>
                      {tripDate.toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col justify-center items-center">
                      <p>{trip.locations.length} stops</p>
                      <p>{metersToDistanceString(trip.locations[trip.locations.length - 1].distance ?? 0)}</p>
                    </div>
                  </TableCell>

                  {trip.locations.map((l: Location, i: number) => (
                    <TableCell key={`${i}_${l.name}`}>
                      <div className="w-40">
                        <div >
                          <div className="overflow-ellipsis overflow-hidden">{capitalizeWords(l.type)}</div>

                          <div className="overflow-ellipsis overflow-hidden">{l.name}</div>

                          <div className="overflow-ellipsis overflow-hidden">{l.distance ? metersToDistanceString(l.distance) : "-"}</div>

                          <div className="overflow-ellipsis overflow-hidden">{l.time ? secondsToDurationString(l.time) : "-"}</div>
                        </div>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </Link>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}