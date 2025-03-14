import { LogbookVisualizer } from "@/modules/logbook/sections/logbook-visualizer";
import { Logbook } from "@/modules/logbook/types/logbook";
import Link from "next/link";


const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const data: Logbook = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook/" + id)
    .then(res => res.json())
    .catch(console.error)

  return (
    <div className="flex flex-col items-end gap-12">
      <LogbookVisualizer logbook= {data} />
      <Link className="bg-neutral-800 mt-4 mr-4 w-20 h-12 rounded flex justify-center items-center text-neutral-100" href={"/logbook/edit/" + id}>Edit</Link>
    </div>
  )
}

export default Page
