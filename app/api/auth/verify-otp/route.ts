import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    console.log("[verify-otp] Received request for phone:", phone, "otp:", otp);

    if (!phone || !otp) {
      console.warn("[verify-otp] Missing phone or OTP in request body.");
      return NextResponse.json(
        { success: false, message: "Phone and OTP are required." },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("[verify-otp] API_KEY environment variable is not set.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const url = `${BASE_URL}/auth/verify-otp`;
    console.log("[verify-otp] Forwarding request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ phone, otp }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    console.log(`[verify-otp] Backend responded with status ${response.status}, content-type: ${contentType}`);

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("[verify-otp] Non-JSON response body:", text.slice(0, 300));
      return NextResponse.json(
        { success: false, message: "Unexpected response from server. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log(`[verify-otp] Response data:`, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[verify-otp] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
