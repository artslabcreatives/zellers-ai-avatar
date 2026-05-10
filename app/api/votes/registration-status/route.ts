import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest) {
	try {
		const res = await fetch(`${BASE_URL}/votes/registration-status`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Registration status check error:", error);
		return NextResponse.json(
			{ success: true, registrationOpen: true, message: "Failed to check registration status" },
			{ status: 500 }
		);
	}
}
