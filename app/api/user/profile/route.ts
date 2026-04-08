import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, displayName, gender } = body;

    console.log("[user/profile] Received profile update:", { name, displayName, gender });

    const token = req.headers.get("authorization");
    if (!token) {
      console.warn("[user/profile] Missing Authorization header.");
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please verify your phone first." },
        { status: 401 }
      );
    }

    if (!name || !displayName) {
      console.warn("[user/profile] Missing required fields.");
      return NextResponse.json(
        { success: false, message: "Name and display name are required." },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("[user/profile] API_KEY environment variable is not set.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const url = `${BASE_URL}/user/profile`;
    console.log("[user/profile] Forwarding PUT request to:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ name, displayName, gender }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    console.log(`[user/profile] Backend responded with status ${response.status}, content-type: ${contentType}`);

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("[user/profile] Non-JSON response body:", text.slice(0, 300));
      return NextResponse.json(
        { success: false, message: "Unexpected response from server. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("[user/profile] Response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[user/profile] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save profile. Please try again." },
      { status: 500 }
    );
  }
}
