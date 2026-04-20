import type { Metadata } from "next";
import VotePageClient from "./VotePageClient";

// API base URL for fetching post data
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.aiavuruduwithzellers.com';
const FRONTEND_BASE = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://aiavuruduwithzellers.com';

// Generate dynamic metadata based on highlight query parameter
export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ highlight?: string }>;
}): Promise<Metadata> {
	// In Next.js 16, searchParams is a Promise
	const params = await searchParams;
	const highlightPostId = params.highlight;

	// Default metadata if no highlight
	if (!highlightPostId) {
		return {
			title: "Vote for Your Favourite Avatar | AI Avurudu with Zellers",
			description: "Vote for your favourite AI Avurudu Kumara or Kumariya! Join the AI Avurudu with Zellers contest and support amazing community creations.",
			openGraph: {
				title: "Vote for Your Favourite Avatar | AI Avurudu with Zellers",
				description: "Vote for your favourite AI Avurudu Kumara or Kumariya! Join the AI Avurudu with Zellers contest.",
				url: `${FRONTEND_BASE}/vote`,
				siteName: "AI Avurudu with Zellers",
				images: [
					{
						url: `${FRONTEND_BASE}/logo.png`,
						width: 1200,
						height: 630,
						alt: "AI Avurudu with Zellers",
					},
				],
				locale: "en_US",
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title: "Vote for Your Favourite Avatar | AI Avurudu with Zellers",
				description: "Vote for your favourite AI Avurudu Kumara or Kumariya!",
				images: [`${FRONTEND_BASE}/logo.png`],
			},
		};
	}

	// Fetch post data for highlighted post
	try {
		const response = await fetch(`${API_BASE}/posts/${highlightPostId}`, {
			next: { revalidate: 60 }, // Revalidate every minute
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch post: ${response.status}`);
		}

		const data = await response.json();

		if (!data.success || !data.postDetails) {
			throw new Error("Post not found");
		}

		const post = data.postDetails;
		const isMale = post.gender === 'male';
		const genderTitle = isMale ? 'අවුරුදු කුමරා' : 'අවුරුදු කුමරිය';
		const title = `${post.displayName}'s Avurudu Avatar`;
		const description = `Vote for ${post.displayName} to become the First ever ${genderTitle} in the AI අවුරුදු With Zellers Contest. Rank #${post.rank || 'N/A'} with ${post.voteCount} votes!`;
		const shareUrl = `${FRONTEND_BASE}/vote?highlight=${highlightPostId}`;

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				url: shareUrl,
				siteName: "AI Avurudu with Zellers",
				images: [
					{
						url: post.imageUrl || `${FRONTEND_BASE}/logo.png`,
						width: 1200,
						height: 630,
						alt: `${post.displayName}'s Avurudu Avatar`,
					},
				],
				locale: "en_US",
				type: "website",
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
				images: [post.imageUrl || `${FRONTEND_BASE}/logo.png`],
			},
		};
	} catch (error) {
		console.error("Error generating metadata for highlighted post:", error);
		// Fallback to default metadata
		return {
			title: "Vote for Your Favourite Avatar | AI Avurudu with Zellers",
			description: "Vote for your favourite AI Avurudu Kumara or Kumariya!",
		};
	}
}

// Server component that renders the client component
export default function VotePage() {
	return <VotePageClient />;
}
