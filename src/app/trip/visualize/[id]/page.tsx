import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalizeWords, metersToDistanceString, secondsToDurationString } from "@/lib/utils";
import { LogbookVisualizer } from "@/modules/logbook/sections/logbook-visualizer";
import { Logbook } from "@/modules/logbook/types/logbook";
import { TripVisualizer } from "@/modules/trip/sections/trip-visualizer";
import { Trip } from "@/modules/trip/types/trip";


const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const resp: {
    trip: Trip,
    logbooks: Logbook[]
  } = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip/" + id)
    .then(res => res.json())
    .catch(console.error)

  if (!resp) return null

  const { trip, logbooks } = resp;

  const startingDate = new Date(trip.start_date);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-row gap-12">
        <TripVisualizer trip={trip} />
        <div>
          <h1 className="w-64 px-4 pt-2 text-2xl font-bold border-b-2 border-neutral-600 dark:border-neutral-400">
            Trip
          </h1>
          
          <div className="flex">
            <div className="flex-1">
              <h2 className="w-64 mt-6 pt-2 text-lg font-bold">
                Starting date
              </h2>

              <p>{`${startingDate.toLocaleTimeString()} - ${startingDate.toLocaleDateString()}`}</p>
            </div>

            <div className="flex-1">
              <h2 className="w-64 mt-4 pt-2 text-lg font-bold">
                Days required
              </h2>

              <p>{logbooks.length}</p>
            </div>
          </div>


          <div>
            <h2 className="w-64 mt-4 pt-2 text-lg font-bold">
              Locations
            </h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stop Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Drive Distance</TableHead>
                  <TableHead>Drive Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trip.locations.map((l, i) => (
                  <TableRow key={`${i}_${l.name}`}>
                    <TableCell>{capitalizeWords(l.type)}</TableCell>
                    <TableCell>{l.name}</TableCell>
                    <TableCell>{l.distance ? metersToDistanceString(l.distance) : "-"}</TableCell>
                    <TableCell>{l.time ? secondsToDurationString(l.time) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {logbooks.map((logbook, i) => (
          <LogbookVisualizer key={`logbook_${i}`} logbook={logbook} />
        ))}
      </div>
    </div>
  )
}

export default Page
