import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {

    const res = await fetch("http://127.0.0.1:8000/api/test").then(res => res.json());

    return NextResponse.json(res);
  } catch (e) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}