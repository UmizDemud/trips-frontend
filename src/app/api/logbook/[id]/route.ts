import { Logbook } from "@/modules/logbook/types/logbook";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/${id}/`);
    
    if (!response.ok) {
      return new NextResponse("Logbook not found", { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(request)
    return new NextResponse(`"Failed to fetch logbook": ${error}`, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: Logbook = await request.json();

  try {
    const response = await fetch(`${process.env.API_URL!}/api/logbook/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new NextResponse("Update process failed", { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(`Failed to fetch logbook: ${error}`, { status: 500 });
  }
}
