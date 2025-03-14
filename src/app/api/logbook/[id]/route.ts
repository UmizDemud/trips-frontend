import { Logbook } from "@/modules/logbook/types/logbook";
import { NextResponse } from "next/server";

export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // 'a', 'b', or 'c'

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/${id}/`);
    
    if (!response.ok) {
      return new NextResponse("Logbook not found", { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(`"Failed to fetch logbook": ${error}`, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // 'a', 'b', or 'c'
  const body: Logbook = await request.json();

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .catch(console.error);


    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse(`Failed to fetch logbook: ${error}`, { status: 500 });
  }
}
