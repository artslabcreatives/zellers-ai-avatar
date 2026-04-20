"use client";

import { Suspense } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import MeetTheAvatars from "./components/MeetTheAvatars";
import AvuruduPrizes from "./components/AvuruduPrizes";
import Footer from "./components/Footer";
import { useAnalytics } from "@/lib/useAnalytics";

function AnalyticsTracker({ pageName }: { pageName: string }) {
	useAnalytics(pageName);
	return null;
}

function HomeContent() {
	return (
		<main className="min-h-screen bg-transparent">
			<Navbar />
			<HeroSection />
			<HowItWorks />
			<MeetTheAvatars />
			<AvuruduPrizes />
			<Footer />
		</main>
	);
}

export default function Home() {
	return (
		<>
			<Suspense fallback={null}>
				<AnalyticsTracker pageName="home" />
			</Suspense>
			<HomeContent />
		</>
	);
}
