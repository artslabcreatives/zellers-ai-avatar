import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import MeetTheAvatars from "./components/MeetTheAvatars";
import AvuruduPrizes from "./components/AvuruduPrizes";
import Footer from "./components/Footer";
import RegistrationReminder from "./components/RegistrationReminder";

export default function Home() {
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
