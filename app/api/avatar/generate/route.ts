import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = `${BASE_URL}/avatar/generate`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Avatar generation proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate avatar." },
      { status: 500 }
    );
  }
}
