import { LogbookVisualizer } from "@/modules/logbook/sections/logbook-visualizer";
import { Logbook } from "@/modules/logbook/types/logbook";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const data: Logbook = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook/" + id)
    .then(res => {

      if (res.ok) {
        return res.json()
      }
    })
    .catch(console.error)

  if (!data) return null;

  return (
    <div className="w-full flex flex-col items-end gap-8 md:pr-12">
      <LogbookVisualizer logbook={data} />
      <Link className="bg-neutral-800 md:mr-4 mb-6 mr-2 w-20 h-12 rounded flex justify-center items-center text-neutral-100" href={"/logbook/edit/" + id}>Edit</Link>
    </div>
  )
}

export default Page
