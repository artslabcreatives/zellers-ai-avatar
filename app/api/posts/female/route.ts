import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function GET(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
  }
  const page = req.nextUrl.searchParams.get("page") ?? "1";
  try {
    const res = await fetch(`${BASE_URL}/posts/female?page=${page}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
      cache: "no-store",
    });
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      await res.text();
      return NextResponse.json({ success: false, message: "Unexpected response from server." }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch posts." }, { status: 500 });
  }
}
