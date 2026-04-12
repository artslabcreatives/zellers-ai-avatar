import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.API_KEY?.replace(/\/$/, "");

export async function POST(req: NextRequest) {
	if (!BASE_URL) {
		return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
	}
	try {
		const token = req.headers.get("authorization");
		if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

		const res = await fetch(`${BASE_URL}/avatar/submit`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "Authorization": token },
		});
		const text = await res.text();
		let data;
		try { data = JSON.parse(text); } catch {
			return NextResponse.json({ success: false, message: "Backend returned invalid response." }, { status: 502 });
		}
		return NextResponse.json(data, { status: res.status });
	} catch {
		return NextResponse.json({ success: false, message: "Failed to submit avatar." }, { status: 500 });
	}
}
