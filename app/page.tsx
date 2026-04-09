"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import MeetTheAvatars from "./components/MeetTheAvatars";
import AvuruduPrizes from "./components/AvuruduPrizes";
import Footer from "./components/Footer";
import RegistrationReminder from "./components/RegistrationReminder";
import { useAnalytics } from "@/lib/useAnalytics";

export default function Home() {
  useAnalytics('home');
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <MeetTheAvatars />
      <AvuruduPrizes />
      <Footer />
      <RegistrationReminder />
    </main>
  );
}
