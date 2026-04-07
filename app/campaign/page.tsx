"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Smartphone, User, Star, Sparkles, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, key: "VERIFY",   label: "VERIFY",   icon: Smartphone },
  { id: 2, key: "PROFILE",  label: "PROFILE",  icon: User },
  { id: 3, key: "QUIZ",     label: "QUIZ",     icon: Star },
  { id: 4, key: "GENERATE", label: "GENERATE", icon: Sparkles },
];

const FLAVORS = [
  { id: "mint",    emoji: "🌿", name: "MINT CHOCOLATE",    sinhala: "මින්ට් චොකලට්" },
  { id: "dark",    emoji: "🍫", name: "DARK VELVET",       sinhala: "ඩාක් වෙල්වට්" },
  { id: "caramel", emoji: "🍯", name: "GOLDEN CARAMEL",    sinhala: "ගෝල්ඩන් කැරමල්" },
  { id: "cherry",  emoji: "🍒", name: "CHERRY BLISS",      sinhala: "චෙරි බ්ලිස්" },
  { id: "hazel",   emoji: "🌰", name: "HAZELNUT ROYALE",   sinhala: "හේසල්නට් රොයල්" },
  { id: "white",   emoji: "🤍", name: "WHITE DREAM",       sinhala: "වයිට් ඩ්‍රීම්" },
];

// ─── Slide animation variants ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.25, ease: "easeIn" as const } }),
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 w-full max-w-xs mx-auto">
      {STEPS.map((step, idx) => {
        const done    = current > step.id;
        const active  = current === step.id;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 transition-all duration-300",
                  active
                    ? "border-yellow-400 bg-yellow-500/20 text-yellow-400 shadow-[0_0_14px_rgba(234,179,8,0.4)]"
                    : done
                    ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-500"
                    : "border-white/15 bg-white/5 text-gray-500",
                ].join(" ")}
              >
                {done ? <CheckCircle2 size={16} className="text-yellow-400" /> : step.id}
              </div>
              <span
                className={[
                  "text-[9px] font-bold tracking-[0.2em]",
                  active ? "text-yellow-400" : done ? "text-yellow-500/70" : "text-gray-600",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  "h-px w-8 sm:w-10 mx-1 mb-5 transition-all duration-500",
                  done ? "bg-yellow-500/50" : "bg-white/10",
                ].join(" ")}
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
      {/* Phone field */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
          MOBILE NUMBER <span className="text-yellow-500/70">• ඔබේ දූරකථන අංකය</span>
        </label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-gray-300 font-semibold shrink-0 select-none">
            <span className="text-xs">🇱🇰</span>
            <span>LK +94</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="7X XXX XXXX"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 focus:bg-white/8 transition-all duration-200"
          />
        </div>
      </div>

      {/* OTP field (shown after send) */}
      <AnimatePresence>
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
              OTP CODE <span className="text-yellow-500/70">• ඔටිපී කේතය</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-all duration-200 tracking-[0.5em] text-center font-bold"
            />
            <p className="text-xs text-gray-600 text-center">OTP sent to +94 {phone}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary action button */}
      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          disabled={phone.length < 9 || loading}
          className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-extrabold tracking-widest rounded-xl py-4 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "SENDING…" : "SEND OTP → ඔටිපී යවන්න"}
        </button>
      ) : (
        <button
          onClick={handleVerify}
          disabled={otp.length < 4}
          className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-extrabold tracking-widest rounded-xl py-4 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          VERIFY → තහවුරු කරන්න
        </button>
      )}
    </div>
  );
}

// ─── Step 2: Profile ──────────────────────────────────────────────────────────
function StepProfile({ onNext }: { onNext: () => void }) {
  const [name, setName]     = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [age, setAge]       = useState("");

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
          FULL NAME <span className="text-yellow-500/70">• ඔබේ නම</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
          AVATAR TYPE <span className="text-yellow-500/70">• ස්ත්‍රී / පුරුෂ</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={[
                "flex flex-col items-center gap-2 border rounded-xl py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200",
                gender === g
                  ? "border-yellow-500/60 bg-yellow-500/10 text-yellow-400"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:bg-white/8",
              ].join(" ")}
            >
              <span className="text-2xl">{g === "male" ? "👑" : "👸"}</span>
              {g === "male" ? "KUMARA" : "KUMARIYA"}
              <span className="text-[9px] text-yellow-500/60">{g === "male" ? "කුමාරයා" : "කුමාරිය"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
          AGE <span className="text-yellow-500/70">• වයස</span>
        </label>
        <input
          type="number"
          min={13}
          max={99}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Your age"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-all duration-200"
        />
      </div>

      <button
        onClick={onNext}
        disabled={!name || !gender || !age}
        className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-extrabold tracking-widest rounded-xl py-4 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        CONTINUE <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Step 3: Quiz (Flavor) ────────────────────────────────────────────────────
function StepQuiz({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-400 text-center leading-relaxed">
        Choose your favorite Zellers chocolate.<br />
        <span className="text-yellow-400/70">ඔබේ ප්‍රිය රසය තෝරන්න.</span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        {FLAVORS.map((flavor) => (
          <button
            key={flavor.id}
            onClick={() => setSelected(flavor.id)}
            className={[
              "flex flex-col items-start gap-1 border rounded-xl px-4 py-3 text-left transition-all duration-200",
              selected === flavor.id
                ? "border-yellow-500/60 bg-yellow-500/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
            ].join(" ")}
          >
            <span className="text-xl">{flavor.emoji}</span>
            <span className={["text-xs font-extrabold tracking-widest", selected === flavor.id ? "text-yellow-400" : "text-gray-300"].join(" ")}>
              {flavor.name}
            </span>
            <span className="text-[10px] text-gray-600">{flavor.sinhala}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-extrabold tracking-widest rounded-xl py-4 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        NEXT STEP <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Step 4: Generate ─────────────────────────────────────────────────────────
function StepGenerate() {
  const [generating, setGenerating] = useState(false);
  const [done, setDone]             = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 2800);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="flex flex-col items-center gap-6 text-center py-4"
      >
        <div className="text-6xl">✨</div>
        <div>
          <p className="text-xl font-black text-yellow-400 tracking-wide mb-1">AVATAR CREATED!</p>
          <p className="text-sm text-gray-400">ඔබේ AI Avurudu Avatar සූදානම්!</p>
        </div>
        <div className="w-40 h-52 rounded-2xl bg-white/5 border border-yellow-500/30 flex items-center justify-center text-gray-500 text-xs tracking-widest">
          AVATAR PREVIEW
        </div>
        <div className="flex gap-3 w-full">
          <button className="flex-1 text-xs font-bold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full py-3 hover:brightness-110 transition-all duration-200">
            DOWNLOAD
          </button>
          <button className="flex-1 text-xs font-bold tracking-widest text-yellow-400 border border-yellow-500/40 rounded-full py-3 hover:bg-yellow-500/10 transition-all duration-200">
            SHARE
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      {generating ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-yellow-400/40 animate-spin" style={{ animationDuration: "1.5s" }} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-400 tracking-widest">GENERATING YOUR AVATAR…</p>
            <p className="text-xs text-gray-500 mt-1">AI රාජකීය රූපය සාදමින්…</p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="text-5xl">🤖</div>
          <div>
            <p className="text-base font-bold text-gray-200">Ready to generate!</p>
            <p className="text-sm text-gray-500 mt-1">ඔබේ AI Avatar සාදා ගැනීමට සූදානම්</p>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full bg-linear-to-r from-yellow-500 to-amber-400 text-black text-sm font-extrabold tracking-widest rounded-xl py-4 hover:brightness-110 transition-all duration-200 animate-pulse"
            style={{ boxShadow: "0 0 20px rgba(234,179,8,0.3)" }}
          >
            ✨ GENERATE MY AVATAR
          </button>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CampaignPage() {
  const [step, setStep] = useState(1);
  const [dir, setDir]   = useState(1);

  function goNext() { setDir(1); setStep((s) => Math.min(s + 1, 4)); }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-start justify-center px-4 py-12 pt-28">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-175 h-175 rounded-full bg-purple-800/15 blur-[140px]" />
        <div className="absolute w-100 h-100 rounded-full bg-yellow-700/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Campaign poster / logo card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-48 border border-white/15 rounded-xl overflow-hidden bg-[#0D0B38]">
            {/* Poster top glow */}
            <div className="absolute inset-0 bg-linear-to-b from-yellow-500/5 to-transparent pointer-events-none" />
            <div className="flex flex-col items-center px-5 py-6 gap-1 text-center">
              {/* AI text */}
              <p className="text-3xl font-black tracking-tight leading-none" style={{ fontFamily: "serif" }}>
                <span className="text-gray-100">AI</span>
              </p>
              {/* Sinhala title */}
              <p className="text-3xl font-black text-gray-100 leading-tight" style={{ fontFamily: "serif" }}>
                අවුරුදු
              </p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">with</p>
              {/* Zellers brand */}
              <p className="text-2xl font-extrabold tracking-widest bg-linear-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent mt-1">
                Zellers
              </p>
              <div className="text-yellow-500 text-lg leading-none">👑</div>
              <p className="text-[8px] tracking-[0.3em] uppercase text-gray-500 mt-0.5">SINCE 1964</p>
              <p className="text-[8px] tracking-[0.35em] uppercase text-gray-500">CHOCOLATES</p>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" as const }}
          className="text-center mb-2"
        >
          <h1 className="text-2xl font-black tracking-wide text-gray-100">
            JOIN THE{" "}
            <span className="text-yellow-400">CAMPAIGN</span>
          </h1>
          <p className="text-base font-bold text-yellow-400 mt-1">ඔබේ Avatar සාදා ගන්න</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-xs text-gray-500 text-center leading-relaxed mb-8 px-4"
        >
          Complete all steps to generate your unique AI Avurudu avatar and enter the competition.
        </motion.p>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <StepIndicator current={step} />
        </motion.div>

        {/* Form card */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
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
        </div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-center mt-6"
        >
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 tracking-widest transition-colors duration-200">
            ← BACK TO HOME
          </a>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
