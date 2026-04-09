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
		const formData = await req.formData();
		const token = req.headers.get("authorization");

		if (!token) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const url = `${BASE_URL}/api/images/upload`;
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Authorization": token,
			},
			body: formData,
		});

		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Upload proxy error:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to upload image." },
			{ status: 500 }
		);
	}
}
