import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"

import { Trip } from "@/modules/trip/types/trip";
import { TripList } from "@/modules/trip/sections/trip-list";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const data: Trip[] = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip")
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(console.error)

  return (
    <div className="overflow-scroll-x">
      <h1 className="w-64 px-4 pt-2 mb-12 text-2xl font-bold border-b-2 border-neutral-600 dark:border-neutral-400">
        Trips
      </h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Service is busy try again in 50(s)</p>}>
          <TripList data={data} />
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}