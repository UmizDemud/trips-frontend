import { LogbookVisualizer } from "@/modules/logbook/sections/logbook-visualizer";
import { Logbook } from "@/modules/logbook/types/logbook";

export default async function Page() {

  const data: Logbook[] = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook")
    .then(res => res.json())
    .catch(console.error)

  return (
    <div className="flex flex-col gap-12">
      {data.map((logbook, i) => (
        <LogbookVisualizer key={`${i}_${logbook.date}`} logbook={logbook} />
      ))}
    </div>
  )
}