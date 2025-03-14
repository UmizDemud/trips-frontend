import { Trip } from "@/modules/trip/types/trip";


export default async function Home() {

  const data: Trip[] = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/api/trip")
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(console.error)

  console.log(data)
  

  return (
    <>Home Page</>
  );
}
