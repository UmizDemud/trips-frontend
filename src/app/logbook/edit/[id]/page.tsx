
import { LogbookEdit } from "@/modules/logbook/sections/logbook-edit";
import { Logbook } from "@/modules/logbook/types/logbook";

const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const logbook: Logbook = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook/" + id)
    .then(res => res.json())
    .catch(console.error)

  return (
    <LogbookEdit logbook={logbook} />
  )
}

export default Page