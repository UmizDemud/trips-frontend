import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params // 'a', 'b', or 'c'

  try {
    const trip = await fetch(`${process.env.API_URL!}/api/trip/${id}/`);
    const logbooks = await fetch(`${process.env.API_URL!}/api/logbook/?trip=${id}`);

    if (!trip.ok || !logbooks.ok) {
      return new NextResponse("Trip not found", { status: 404 });
    }

    const tripData = await trip.json();
    const logbooksData = await logbooks.json();

    return NextResponse.json({
      trip: tripData,
      logbooks: logbooksData,
    });
  } catch (error) {
    return new NextResponse(`Failed to fetch trip: ${error}`, { status: 500 });
  }
}
