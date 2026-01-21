import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({ error: "Refresh token functionality not implemented" }, { status: 501 });
}
