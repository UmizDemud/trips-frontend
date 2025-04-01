import { Trip } from "@/modules/trip/types/trip";
import { ArrowRight } from "lucide-react";


export default async function Home() {

  // This fetch is here to facilitate Render service to startup the backend. (Cold start)

  const data: Trip[] = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip")
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(console.error)


  return (
    <div>
      <div className="flex gap-2">
        <ArrowRight />
        Navigate
      </div>
      <ul className="pl-12 list-disc">
        <li>
          <div>
            /trip :  To see a snap of the database, a strong sifting (filter, sort) takes time, so was not implemented.
          </div>
        </li>
        <li>
          <div>
            /trip/new :  For the simple routing form & api
          </div>
        </li>
        <li>
          Use the UI to see what is available
        </li>
      </ul>
    </div>
  );
}
