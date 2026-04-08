"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Smartphone, User, Star, Sparkles, CheckCircle2, Camera, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ─── Step Definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, key: "VERIFY",   label: "VERIFY",   icon: Smartphone },
  { id: 2, key: "PROFILE",  label: "PROFILE",  icon: User },
  { id: 3, key: "QUIZ",     label: "QUIZ",     icon: Star },
  { id: 4, key: "GENERATE", label: "GENERATE", icon: Sparkles },
];

const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "What is your favorite chocolate flavor?",
    sinhala: "ඔබේ ප්‍රියතම චොකලට් රසය කුමක්ද?",
    options: [
      { id: "dark", label: "Dark Velvet", emoji: "🍫" },
      { id: "mint", label: "Mint Crunch", emoji: "🌿" },
      { id: "white", label: "White Dream", emoji: "🤍" },
      { id: "hazel", label: "Hazelnut", emoji: "🌰" },
    ],
  },
  {
    id: "q2",
    question: "Which Avurudu tradition excites you most?",
    sinhala: "ඔබ වඩාත් ප්‍රිය කරන අවුරුදු චාරිත්‍රය?",
    options: [
      { id: "sweets", label: "Sweetmeats", emoji: "🍯" },
      { id: "games", label: "Avurudu Games", emoji: "🎯" },
      { id: "family", label: "Visiting Family", emoji: "👨‍👩‍👧‍👦" },
      { id: "clothes", label: "New Clothes", emoji: "👘" },
    ],
  },
  {
    id: "q3",
    question: "Choose your royal Avatar vibe:",
    sinhala: "ඔබේ Avatar හි ස්වභාවය තෝරන්න:",
    options: [
      { id: "majestic", label: "Majestic Royal", emoji: "👑" },
      { id: "warrior", label: "Fierce Warrior", emoji: "⚔️" },
      { id: "classic", label: "Classic Village", emoji: "🌾" },
      { id: "modern", label: "Modern Fusion", emoji: "✨" },
    ],
  },
  {
    id: "q4",
    question: "Pick your lucky Avurudu color palette:",
    sinhala: "ඔබේ වාසනාවන්ත වර්ණය තෝරන්න:",
    options: [
      { id: "gold", label: "Gold & Ruby", emoji: "🔴" },
      { id: "blue", label: "Sapphire Blue", emoji: "🔵" },
      { id: "green", label: "Emerald Green", emoji: "🟢" },
      { id: "pearl", label: "Pearl White", emoji: "⚪" },
    ],
  },
];

// ─── Slide Animation Variants ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.3, ease: "easeIn" as const } }),
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 w-full max-w-[320px] mx-auto px-2">
      {STEPS.map((step, idx) => {
        const done   = current > step.id;
        const active = current === step.id;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all duration-500 ${
                  active
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-110"
                    : done
                    ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-500"
                    : "border-white/10 bg-white/5 text-gray-500"
                }`}
              >
                {done ? <CheckCircle2 size={18} strokeWidth={3} className="text-yellow-400" /> : <step.icon size={16} strokeWidth={2.5} />}
              </div>
              <span
                className={`absolute -bottom-5 text-[8px] sm:text-[9px] font-bold tracking-[0.2em] transition-colors duration-300 ${
                  active ? "text-yellow-400" : done ? "text-yellow-500/70" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-all duration-500 ${
                  done ? "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Verify ───────────────────────────────────────────────────────────
function StepVerify({ onNext }: { onNext: () => void }) {
  const [phone, setPhone]       = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [otp, setOtp]           = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSendOtp() {
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setOtpSent(true); }, 1200);
  }

  function handleVerify() {
    if (otp.length < 4) return;
    onNext();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
          MOBILE NUMBER <span className="text-yellow-500/70">• දුරකථන අංකය</span>
        </label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-300 font-semibold shrink-0 select-none backdrop-blur-md">
            <span className="text-base">🇱🇰</span>
            <span>+94</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="7X XXX XXXX"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 outline-none focus:border-yellow-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-300 backdrop-blur-md"
          />
        </div>
      </div>

      <AnimatePresence>
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mt-2">
              OTP CODE <span className="text-yellow-500/70">• කේතය</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xl text-yellow-400 placeholder-gray-500 outline-none focus:border-yellow-500/50 transition-all duration-300 tracking-[0.5em] text-center font-bold backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          disabled={phone.length < 9 || loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? "SENDING…" : "SEND OTP"}
        </button>
      ) : (
        <button
          onClick={handleVerify}
          disabled={otp.length < 4}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all duration-300"
        >
          VERIFY
        </button>
      )}
    </div>
  );
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────
function StepProfile({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({ name: "", displayName: "" });

  const isComplete = Object.values(form).every((val) => val.trim() !== "");

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="shashith perera"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1 block">
          Display Name for Character <span className="text-yellow-500/70 normal-case tracking-normal hidden sm:inline">• Shown on your Avatar</span>
        </label>
        <input
          type="text"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          placeholder="e.g. The Golden Prince"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!isComplete}
        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all mt-4 flex justify-center items-center gap-2"
      >
        CONTINUE <ChevronRight size={18} strokeWidth={3} />
      </button>
    </div>
  );
}

// ─── Step 3: Quiz (Dynamic Flow) ──────────────────────────────────────────────
function StepQuiz({ onNext }: { onNext: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQ = QUIZ_QUESTIONS[currentQIndex];
  const isLastQ = currentQIndex === QUIZ_QUESTIONS.length - 1;

  function handleSelect(optionId: string) {
    setAnswers({ ...answers, [currentQ.id]: optionId });
    if (!isLastQ) {
      setTimeout(() => setCurrentQIndex((prev) => prev + 1), 300);
    }
  }

  return (
    <div className="relative min-h-[300px] flex flex-col">
      {/* Quiz Progress */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentQIndex((p) => Math.max(0, p - 1))}
          className={`text-gray-400 hover:text-yellow-400 transition-colors ${currentQIndex === 0 ? "invisible" : ""}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-1.5">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentQIndex ? "w-6 bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]" : i < currentQIndex ? "w-2 bg-yellow-400/50" : "w-2 bg-white/10"}`} />
          ))}
        </div>
        <div className="w-5" /> {/* Spacer for alignment */}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <h3 className="font-playfair text-lg sm:text-xl font-normal text-gray-100 text-center mb-1 drop-shadow-sm">{currentQ.question}</h3>
          <p className="text-xs text-yellow-400/80 text-center mb-6">{currentQ.sinhala}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                    isSelected
                      ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
                  }`}
                >
                  <span className="text-2xl drop-shadow-md">{opt.emoji}</span>
                  <span className={`font-semibold text-sm ${isSelected ? "text-yellow-400" : "text-gray-200"}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all flex justify-center items-center gap-2"
        >
          COMPLETE QUIZ <CheckCircle2 size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Generate (Upload -> Wait -> Result) ──────────────────────────────
function StepGenerate() {
  const [phase, setPhase] = useState<"upload" | "generating" | "result">("upload");
  const [file, setFile] = useState<boolean>(false);

  function handleFakeUpload() {
    // Simulate file selection
    setFile(true);
  }

  function handleGenerate() {
    setPhase("generating");
    setTimeout(() => { setPhase("result"); }, 3500);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] text-center w-full">
      <AnimatePresence mode="wait">
        
        {/* PHASE 1: UPLOAD */}
        {phase === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <h3 className="font-playfair text-xl font-normal text-gray-100 mb-1 drop-shadow-sm">Upload your Selfie</h3>
            <p className="text-xs text-gray-400 mb-6">We need a clear, front-facing photo to generate your Avatar.</p>
            
            <button 
              onClick={handleFakeUpload}
              className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 backdrop-blur-md ${
                file ? "border-green-500/50 bg-green-500/10" : "border-white/20 bg-white/5 hover:border-yellow-500/50 hover:bg-yellow-500/5"
              }`}
            >
              {file ? (
                <>
                  <CheckCircle2 size={40} className="text-green-400 drop-shadow-md" />
                  <span className="text-sm font-bold text-green-400">Selfie Ready!</span>
                </>
              ) : (
                <>
                  <Camera size={40} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-400 tracking-wide">Tap to Upload Photo</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerate}
              disabled={!file}
              className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 transition-all flex justify-center items-center gap-2"
            >
              <Sparkles size={18} strokeWidth={2.5} /> GENERATE AVATAR
            </button>
          </motion.div>
        )}

        {/* PHASE 2: GENERATING */}
        {phase === "generating" && (
          <motion.div key="gen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-yellow-500/20" />
              <div className="absolute inset-0 rounded-full border-[3px] border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full border-[3px] border-amber-500/20" />
              <div className="absolute inset-4 rounded-full border-[3px] border-b-amber-400 border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <Sparkles size={32} className="text-yellow-400 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            </div>
            <div>
              <p className="text-lg font-black text-yellow-400 tracking-widest animate-pulse drop-shadow-md">CRAFTING MAGIC…</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-[0.2em]">Applying Royal Assets</p>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: RESULT */}
        {phase === "result" && (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-md mb-4">
              AVATAR READY!
            </p>
            
            {/* Stunning Gold Frame for Avatar */}
            <div className="relative w-56 h-72 p-1 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-600 to-yellow-800 shadow-[0_10px_30px_rgba(234,179,8,0.3)] mb-6">
              <div className="w-full h-full rounded-xl bg-[#0D0B38] overflow-hidden flex flex-col items-center justify-center relative">
                 <div className="absolute inset-0 bg-[url('https://via.placeholder.com/400x600/1a1a2e/ffffff?text=AI+Avatar')] bg-cover bg-center opacity-80 mix-blend-screen" />
                 {/* Fallback text if image doesn't load visually */}
                 <span className="relative z-10 text-xs font-bold tracking-widest text-yellow-400/50">YOUR PORTRAIT</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black tracking-widest rounded-full py-3.5 hover:scale-105 shadow-[0_4px_15px_rgba(234,179,8,0.3)] transition-all">
                DOWNLOAD
              </button>
              <button className="flex-1 border-2 border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs font-black tracking-widest rounded-full py-3.5 hover:bg-yellow-500/20 transition-all backdrop-blur-sm">
                SHARE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function CampaignPage() {
  const [step, setStep] = useState(1);
  const [dir, setDir]   = useState(1);

  function goNext() { 
    setDir(1); 
    setStep((s) => Math.min(s + 1, 4)); 
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      
      {/* ─── EXPERT UI: Unified Fixed Mesh Gradient Background ─── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]" // Deep violet/indigo base
      >
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#9D00FF]/30 blur-[140px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#6A00F4]/30 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-500/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16 pt-28 relative z-10">
        
        <div className="relative w-full max-w-md">
          
          {/* Header Title Area */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-4 backdrop-blur-md shadow-sm">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-yellow-400 uppercase">Avurudu Campaign</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-4xl font-normal tracking-wide text-white mb-2 drop-shadow-lg">
              REVEAL YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">ROYAL</span> SELF
            </h1>
            <p className="text-sm text-gray-300 px-4 font-medium">
              Complete the steps below to generate your legendary AI Avatar and enter the Zellers competition.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <StepIndicator current={step} />
          </motion.div>

          {/* Interactive Form Card (Frosted Glassmorphism Upgrade) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl overflow-hidden mt-4"
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {step === 1 && <StepVerify  onNext={goNext} />}
                {step === 2 && <StepProfile onNext={goNext} />}
                {step === 3 && <StepQuiz    onNext={goNext} />}
                {step === 4 && <StepGenerate />}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
      
      {/* Set footer z-index so it sits correctly on top of fixed background */}
      <div className="relative z-10">
         <Footer />
      </div>
    </div>
  );
}