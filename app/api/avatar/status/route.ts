import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function GET(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Server configuration error." },
      { status: 500 }
    );
  }

  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = `${BASE_URL}/avatar/status`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Avatar status proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check avatar status." },
      { status: 500 }
    );
  }
}
