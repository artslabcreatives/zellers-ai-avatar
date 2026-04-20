import { NextRequest, NextResponse } from "next/server";

// Only proxy images from our trusted storage domain
const ALLOWED_HOSTNAME_SUFFIX = ".wasabisys.com";

export async function GET(req: NextRequest) {
	const url = req.nextUrl.searchParams.get("url");

	if (!url) {
		return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
	}

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return NextResponse.json({ error: "Invalid url." }, { status: 400 });
	}

	// Security: only proxy images from our Wasabi storage
	if (!parsed.hostname.endsWith(ALLOWED_HOSTNAME_SUFFIX)) {
		return NextResponse.json({ error: "Forbidden." }, { status: 403 });
	}

	try {
		const upstream = await fetch(url);
		if (!upstream.ok) {
			return NextResponse.json({ error: "Failed to fetch image." }, { status: 502 });
		}

		const contentType = upstream.headers.get("content-type") || "image/jpeg";
		const buffer = await upstream.arrayBuffer();

		return new NextResponse(buffer, {
			headers: {
				"Content-Type": contentType,
				"Content-Disposition": 'attachment; filename="zellers-avurudu-avatar.jpg"',
				"Cache-Control": "no-store",
			},
		});
	} catch {
		return NextResponse.json({ error: "Download failed." }, { status: 500 });
	}
}
