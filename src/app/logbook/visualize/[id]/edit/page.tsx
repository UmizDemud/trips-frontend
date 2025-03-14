import { LogbookForm } from "@/modules/logbook/sections/logbook-form";
import { Logbook } from "@/modules/logbook/types/logbook";

const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const data: Logbook = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook/" + id)
    .then(res => res.json())
    .catch(console.error)

  return (
    <div className="p-2">
      <LogbookForm logbook={data} />
    </div>
  )
}

export default Page;
