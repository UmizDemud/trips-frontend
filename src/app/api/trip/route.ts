import { Trip } from "@/modules/trip/types/trip";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {

  const body: Trip = await request.json();

  try {

    const response = await fetch(`${process.env.API_URL!}/api/trip/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create trip");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return new Response(`Failed to create trip: ${error}`, {status: 500})
  }
}

export async function GET() {

  try {
    const response = await fetch(`${process.env.API_URL!}/api/trip/`, {
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse(`Failed to fetch trips: ${error}`, {status: 500})
  }
}