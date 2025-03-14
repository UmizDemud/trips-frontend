import { Logbook } from "@/modules/logbook/types/logbook";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {

  const body: Logbook = await request.json();

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/`, {
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
    return new Response(`Failed to create logbook: ${error}`, {status: 500})
  }
}

export async function GET() {

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/`);
    const data = await response.json();
    return NextResponse.json(data)
  } catch (error) {
    return new NextResponse(`Failed to fetch logbooks: ${error}`, {status: 500})
  }
}