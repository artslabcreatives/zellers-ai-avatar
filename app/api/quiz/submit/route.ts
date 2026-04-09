import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body;

    const token = req.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please verify your phone first." },
        { status: 401 }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, message: "Quiz answers are required." },
        { status: 400 }
      );
    }

    if (!BASE_URL) {
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    const url = `${BASE_URL}/quiz/submit`;

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

    if (!contentType.includes("application/json")) {
      await response.text();
      return NextResponse.json(
        { success: false, message: "Unexpected response from server. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to submit quiz. Please try again." },
      { status: 500 }
    );
  }
}
