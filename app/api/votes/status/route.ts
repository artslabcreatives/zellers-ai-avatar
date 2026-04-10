import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";

/**
 * GET /api/votes/status
 * Public endpoint to check if voting is currently open or closed
 */
export async function GET(req: NextRequest) {
	try {
		const res = await fetch(`${BASE_URL}/votes/status`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Voting status check error:", error);
		return NextResponse.json(
			{
				success: false,
				votingOpen: false,
				message: "Failed to check voting status"
			},
			{ status: 500 }
		);
	}
}
