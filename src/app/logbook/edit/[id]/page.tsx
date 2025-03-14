
import { LogbookEdit } from "@/modules/logbook/sections/logbook-edit";
import { Logbook } from "@/modules/logbook/types/logbook";

export const dynamic = 'force-dynamic';

const Page = async ({ params }: {
  params: Promise<{id: number}>,
}) => {

  const { id } = await params;

  const logbook: Logbook | null = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/logbook/" + id)
    .then(res => {
      if (res.ok) {
        return res.json()
      }

      return null;
    })
    .catch(console.error)

  if (!logbook) return null;

  return (
    <LogbookEdit logbook={logbook} />
  )
}

export default Page