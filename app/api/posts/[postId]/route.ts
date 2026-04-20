import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.aiavuruduwithzellers.com';

/**
 * GET /api/posts/:postId - Fetch a single post by ID
 */
export async function GET(
	request: NextRequest,
	context: { params: Promise<{ postId: string }> }
) {
	try {
		const { postId } = await context.params;

		const res = await fetch(`${BASE_URL}/posts/${postId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await res.json();

		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error('Error fetching post:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch post' },
			{ status: 500 }
		);
	}
}
