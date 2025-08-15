import { NextResponse } from "next/server";

// simple healthcheck
export async function GET() {
  return NextResponse.json({ ok: true, env: "prod", version: "v2" });
}

export async function POST(req: Request) {
  const data = await req.json();
  console.log("Lead recibido (prod):", data);
  return NextResponse.json({ ok: true });
}
