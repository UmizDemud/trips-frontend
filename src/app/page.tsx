import { Trip } from "@/modules/trip/types/trip";


export default async function Home() {

  // This fetch is here to facilitate Render service to startup the backend. (Cold start)

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
