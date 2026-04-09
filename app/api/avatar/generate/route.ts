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
		let body = {};
		try {
			body = await req.json();
		} catch {
			// Frontend may send no body
		}
		const token = req.headers.get("authorization");

		if (!token) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const url = `${BASE_URL}/avatar/generate`;
		console.log(`[avatar proxy] POST ${url}`);
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": token,
			},
			body: JSON.stringify(body),
		});

		const text = await res.text();
		console.log(`[avatar proxy] Response status: ${res.status}, body length: ${text.length}`);

		let data;
		try {
			data = JSON.parse(text);
		} catch {
			console.error(`[avatar proxy] Non-JSON response: ${text.substring(0, 500)}`);
			return NextResponse.json(
				{ success: false, message: "Backend returned invalid response." },
				{ status: 502 }
			);
		}

		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Avatar generation proxy error:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to generate avatar." },
			{ status: 500 }
		);
	}
}
