"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Smartphone, User, Star, Sparkles, CheckCircle2, Camera, ArrowLeft, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

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
    question: "What is your favorite Awurudu Kevili?",
    sinhala: "ඔබේ ප්‍රියතම අවුරුදු කැවිලි වර්ගය කුමක්ද?",
    options: [
      { id: "kavum", label: "Konda Kavum", image: "/quiz/kavum.jpg" },
      { id: "kokis", label: "Kokis", image: "/quiz/kokis.jpg" },
      { id: "aluwa", label: "Aluwa", image: "/quiz/aluwa.jpg" },
      { id: "mun", label: "Mun Kavum", image: "/quiz/munkavum.jpg" },
      { id: "aasmi", label: "Aasmi", image: "/quiz/aasmi.jpg" },
      { id: "undu", label: "Undu Walalu", image: "/quiz/unduwalalu.jpg" },
    ],
  },
  {
    id: "q2",
    question: "What is your favorite Awurudu Krida?",
    sinhala: "ඔබ වඩාත් ප්‍රිය කරන අවුරුදු ක්‍රීඩාව කුමක්ද?",
    options: [
      { id: "kotta", label: "Kotta Pora", image: "/quiz/kotta-pora.jpg" },
      { id: "mutti", label: "Kana Mutti", image: "/quiz/kana-mutti.png" },
      { id: "lissana", label: "Lissana Gaha", image: "/quiz/lissana-gaha.png" },
      { id: "kamba", label: "Kamba Adeema", image: "/quiz/kamba-adeema.png" },
      { id: "pancha", label: "Pancha Dameema", image: "/quiz/pancha.jpg" },
      { id: "olinda", label: "Olinda Keliya", image: "/quiz/olinda.png" },
    ],
  },
  {
    id: "q3",
    question: "Choose your favorite Zellers flavor:",
    sinhala: "ඔබේ ප්‍රියතම Zellers රසය තෝරන්න:",
    options: [
      { id: "pistachio", label: "Pistachio Kunafa", image: "/quiz/pistachio-and-kunafa.png" },
      { id: "redvelvet", label: "Red Velvet", image: "/quiz/red-velvet.png" },
      { id: "coconut", label: "Coconut Cream", image: "/quiz/zellers-chocolate-coconut-cream.jpg" },
      { id: "cookie", label: "Cookie Cream", image: "/quiz/zellers-chocolate-cookie-cream-filled.jpg" }, 
      { id: "mixnut", label: "Mix Nut Cream", image: "/quiz/zellers-chocolate-mix-nut-cream.jpg" },
      { id: "strawberry", label: "Strawberry", image: "/quiz/zellers-chocolate-strawberry.jpg" },
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
  const [error, setError]       = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSendOtp() {
    if (phone.length < 9) return;
    setError("");
    setLoading(true);
    const formattedPhone = `+94${phone}`;
    console.log("[StepVerify] Sending OTP to:", formattedPhone);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setError(data.message || "Too many requests. Please wait 30 seconds.");
        setCooldown(30);
      } else if (!res.ok) {
        setError(data.message || "Failed to send OTP. Please try again.");
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (otp.length < 4) return;
    setError("");
    setLoading(true);
    const formattedPhone = `+94${phone}`;
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, otp }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setError(data.message || "Too many attempts. Please wait before trying again.");
      } else if (!res.ok) {
        setError(data.message || "Invalid OTP. Please try again.");
      } else {
        if (data.token) sessionStorage.setItem("auth_token", data.token);
        onNext();
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
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
            onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="7X XXX XXXX"
            disabled={otpSent}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-base text-gray-200 placeholder-gray-500 outline-none focus:border-yellow-500/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-300 backdrop-blur-md disabled:opacity-50"
          />
        </div>
      </div>

      <AnimatePresence>
        {otpSent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mt-2">
              OTP CODE <span className="text-yellow-500/70">• කේතය</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="• • • • • •"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xl text-yellow-400 placeholder-gray-500 outline-none focus:border-yellow-500/50 transition-all duration-300 tracking-[0.5em] text-center font-bold backdrop-blur-md shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          disabled={phone.length < 9 || loading || cooldown > 0}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? "SENDING…" : cooldown > 0 ? `WAIT ${cooldown}s` : "SEND OTP"}
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={otp.length < 4 || loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all duration-300"
          >
            {loading ? "VERIFYING…" : "VERIFY"}
          </button>
          <button onClick={() => { setOtpSent(false); setOtp(""); setError(""); }} className="w-full text-xs text-gray-400 hover:text-yellow-400 transition-colors py-1">
            ← Change number
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────
function StepProfile({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isComplete = Object.values(form).every((val) => val.trim() !== "");

  async function handleSubmit() {
    if (!isComplete) return;
    setError("");
    setIsLoading(true);
    const token = sessionStorage.getItem("auth_token");
    console.log("[StepProfile] Submitting profile:", form);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          displayName: form.displayName,
          gender: form.gender,
        }),
      });
      const data = await res.json();
      console.log("[StepProfile] profile response:", res.status, data);
      if (!res.ok) {
        setError(data.message || "Failed to save profile. Please try again.");
      } else {
        onNext();
      }
    } catch (err) {
      console.error("[StepProfile] network error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1">
          Full Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
          placeholder="shashith perera"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1 block">
          Display Name for Character{" "}
          <span className="text-yellow-500/70 normal-case tracking-normal hidden sm:inline">
            • Shown on your Avatar
          </span>
        </label>
        <input
          type="text"
          value={form.displayName}
          onChange={(e) => { setForm({ ...form, displayName: e.target.value }); setError(""); }}
          placeholder="e.g. The Golden Prince"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md placeholder-gray-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase ml-1">
          Gender
        </label>
        <select
          value={form.gender}
          onChange={(e) => { setForm({ ...form, gender: e.target.value }); setError(""); }}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all backdrop-blur-md"
        >
          <option value="" className="bg-gray-900 text-gray-500">
            Select Gender
          </option>
          <option value="male" className="bg-gray-900">
            Male
          </option>
          <option value="female" className="bg-gray-900">
            Female
          </option>
        </select>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={handleSubmit}
        disabled={!isComplete || isLoading}
        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all mt-4 flex justify-center items-center gap-2"
      >
        {isLoading ? "SAVING…" : <>CONTINUE <ChevronRight size={18} strokeWidth={3} /></>}
      </button>
    </div>
  );
}

// ─── Step 3: Quiz (Upgraded Image Grid) ───────────────────────────────────────
function StepQuiz({ onNext }: { onNext: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentQ = QUIZ_QUESTIONS[currentQIndex];
  const isLastQ = currentQIndex === QUIZ_QUESTIONS.length - 1;

  function handleSelect(optionId: string) {
    setAnswers({ ...answers, [currentQ.id]: optionId });
    if (!isLastQ) {
      setTimeout(() => setCurrentQIndex((prev) => prev + 1), 600);
    }
  }

  async function handleSubmitQuiz() {
    setError("");
    setIsLoading(true);
    const token = sessionStorage.getItem("auth_token");

    // Translate internal { qId: optionId } map → [{ q, answer }] array for backend
    const formattedAnswers = Object.entries(answers).map(([qId, optionId]) => {
      const questionObj = QUIZ_QUESTIONS.find((q) => q.id === qId);
      const optionObj = questionObj?.options.find((o) => o.id === optionId);
      return {
        q: questionObj?.question ?? qId,
        answer: optionObj?.label ?? optionId,
      };
    });

    console.log("[StepQuiz] Submitting formatted answers:", JSON.stringify(formattedAnswers, null, 2));

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });
      const data = await res.json();
      console.log("[StepQuiz] quiz/submit response:", res.status, data);
      if (!res.ok) {
        setError(data.message || "Failed to save quiz. Please try again.");
      } else {
        onNext();
      }
    } catch (err) {
      console.error("[StepQuiz] network error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[420px] flex flex-col w-full">
      {/* Quiz Progress Header */}
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
        <div className="w-5" /> 
      </div>

      {/* Quiz Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full"
        >
          <h3 className="font-playfair text-lg sm:text-xl font-normal text-gray-100 text-center mb-1 drop-shadow-sm px-2">
            {currentQ.question}
          </h3>
          <p className="text-xs text-yellow-400/80 text-center mb-6">{currentQ.sinhala}</p>

          {/* Expert UI: Image Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="group relative w-full aspect-square rounded-2xl overflow-hidden focus:outline-none"
                >
                  {/* Option Image */}
                  <Image 
                    src={opt.image} 
                    alt={opt.label} 
                    fill 
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-500 ${isSelected ? "scale-105" : "group-hover:scale-110"}`}
                    // Fallback background color incase images are missing initially
                    style={{ backgroundColor: '#1E0B4B' }}
                  />

                  {/* Dark Vignette Overlay to make text readable */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? "opacity-80" : "opacity-100"}`} />

                  {/* Label */}
                  <p className="absolute bottom-3 left-2 right-2 text-center text-xs font-bold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10 leading-tight">
                    {opt.label}
                  </p>

                  {/* Selection Indicator Overlay */}
                  <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none ${isSelected ? "border-yellow-400 scale-100 bg-yellow-400/10" : "border-white/10 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:border-white/30"}`} />

                  {/* Checkmark Badge */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="absolute top-2 right-2 bg-yellow-400 rounded-full p-1 shadow-lg z-20"
                      >
                        <Check size={14} strokeWidth={4} className="text-black" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-xs text-red-400 text-center font-semibold bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-4">
        <button
          onClick={handleSubmitQuiz}
          disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length || isLoading}
          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-4 hover:scale-[1.02] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 transition-all flex justify-center items-center gap-2"
        >
          {isLoading ? "SAVING QUIZ…" : <>{"COMPLETE QUIZ"} <CheckCircle2 size={18} strokeWidth={3} /></>}
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
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1E0B4B]"
      >
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#9D00FF]/30 blur-[140px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#6A00F4]/30 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-500/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16 pt-28 relative z-10 w-full">
        
        {/* Adjusted width to max-w-lg to safely fit the 3-column image grid */}
        <div className="relative w-full max-w-lg">
          
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
            <p className="text-sm text-gray-300 px-4 font-medium max-w-md mx-auto">
              Complete the steps below to generate your legendary AI Avatar and enter the Zellers competition.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <StepIndicator current={step} />
          </motion.div>

          {/* Interactive Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] p-4 sm:p-8 backdrop-blur-2xl overflow-hidden mt-4 w-full"
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
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
      
      <div className="relative z-10">
         {/* <Footer /> */}
      </div>
    </div>
  );
}