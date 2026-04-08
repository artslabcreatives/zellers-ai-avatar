import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body;

    console.log("[quiz/submit] Received quiz answers:", JSON.stringify(answers, null, 2));

    const token = req.headers.get("authorization");
    if (!token) {
      console.warn("[quiz/submit] Missing Authorization header.");
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please verify your phone first." },
        { status: 401 }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.warn("[quiz/submit] Missing or invalid answers array.");
      return NextResponse.json(
        { success: false, message: "Quiz answers are required." },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      console.error("[quiz/submit] API_KEY environment variable is not set.");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const url = `${BASE_URL}/quiz/submit`;
    console.log("[quiz/submit] Forwarding POST request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ answers }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    console.log(`[quiz/submit] Backend responded with status ${response.status}, content-type: ${contentType}`);

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("[quiz/submit] Non-JSON response body:", text.slice(0, 300));
      return NextResponse.json(
        { success: false, message: "Unexpected response from server. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("[quiz/submit] Response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[quiz/submit] Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit quiz. Please try again." },
      { status: 500 }
    );
  }
}
