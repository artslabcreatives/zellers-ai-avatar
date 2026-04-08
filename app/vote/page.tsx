"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, X, Smartphone, CheckCircle2, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────
type Filter = "all" | "kumara" | "kumariya" | "top";
type Avatar = {
  id: number;
  rank: number;
  name: string;
  type: "kumara" | "kumariya";
  flavor: string;
  lover: string;
  votes: number;
  badge: string;
  badgeColor: string;
  img: string;
};

// ─── Dummy data ───────────────────────────────────────────────────────────────
const ALL_AVATARS: Avatar[] = [
  {
    id: 1, rank: 1, name: "Nethmi Kumariya", type: "kumariya",
    flavor: "Pistachio", lover: "Kuliath Lover", votes: 2847,
    badge: "ROYAL MYSTIC", badgeColor: "from-violet-500 to-purple-400",
    img: "/avatar-1.jpg",
  },
  {
    id: 2, rank: 2, name: "Sandali Devi", type: "kumariya",
    flavor: "Strawberry Cream", lover: "Kakia Lover", votes: 2103,
    badge: "POPULAR", badgeColor: "from-pink-500 to-rose-400",
    img: "/avatar-1.jpg",
  },
  {
    id: 3, rank: 3, name: "Sahan Kumara", type: "kumara",
    flavor: "Milk Chocolate", lover: "Karum Lover", votes: 1967,
    badge: "GENTLE SOUL", badgeColor: "from-sky-500 to-blue-400",
    img: "/avatar-2.jpg",
  },
  {
    id: 4, rank: 4, name: "Chamari Deviyani", type: "kumariya",
    flavor: "Hazelnut Praline", lover: "Kakia Lover", votes: 1442,
    badge: "BOLD WARRIOR", badgeColor: "from-amber-500 to-orange-400",
    img: "/avatar-2.jpg",
  },
  {
    id: 5, rank: 5, name: "Kasun Deva", type: "kumara",
    flavor: "Dark Chocolate", lover: "Kiribath Lover", votes: 1188,
    badge: "MOON SILVER", badgeColor: "from-slate-400 to-gray-300",
    img: "/avatar-3.png",
  },
  {
    id: 6, rank: 6, name: "Hiruni Kumariya", type: "kumariya",
    flavor: "Milk Chocolate", lover: "Aluwa Lover", votes: 987,
    badge: "NARITA SOUL", badgeColor: "from-teal-500 to-emerald-400",
    img: "/avatar-4.png",
  },
  {
    id: 7, rank: 7, name: "Ravindu Kumara", type: "kumara",
    flavor: "Golden Caramel", lover: "Kavum Lover", votes: 876,
    badge: "SUN KING", badgeColor: "from-yellow-500 to-amber-400",
    img: "/avatar-3.png",
  },
  {
    id: 8, rank: 8, name: "Amaya Devi", type: "kumariya",
    flavor: "Cherry Bliss", lover: "Kokis Lover", votes: 754,
    badge: "CHERRY QUEEN", badgeColor: "from-red-500 to-pink-400",
    img: "/avatar-4.png",
  },
];

// Campaign ends April 14, 2026
const TARGET_DATE = new Date("2026-04-14T23:59:59");

// ─── Countdown hook time ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000)  / 60_000),
      seconds: Math.floor((diff % 60_000)     / 1_000),
    };
  }, [target]);

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  return time;
}

// ─── Countdown display ────────────────────────────────────────────────────────
function CountdownTimer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);

  if (!mounted) return (
    <div className="flex items-center gap-0.5 sm:gap-1 justify-center">
      {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, i) => (
        <div key={label} className="flex items-center gap-0.5 sm:gap-1">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums w-10 sm:w-14 text-center text-gray-100">00</span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 mt-0.5">{label}</span>
          </div>
          {i < 3 && <span className="text-xl sm:text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>}
        </div>
      ))}
    </div>
  );
  const units = [
    { label: "HOURS",   value: hours },
    { label: "MINUTES", value: minutes },
    { label: "SECONDS", value: seconds },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* DAYS — first position */}
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 tabular-nums w-10 sm:w-14 text-center drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
            {String(days).padStart(2, "0")}
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-yellow-500 mt-0.5">DAYS</span>
        </div>
        {/* separator */}
        <span className="text-xl sm:text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-0.5 sm:gap-1">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-100 tabular-nums w-10 sm:w-14 text-center drop-shadow-md">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 mt-0.5">{u.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-xl sm:text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Vote Modal ──────────────────────────────────────────────────────────────
type VoteModalProps = {
  avatar: Avatar | null;
  onClose: () => void;
  onSuccess: (id: number) => void;
};

function VoteModal({ avatar, onClose, onSuccess }: VoteModalProps) {
  const [phase, setPhase] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendOtp() {
    if (phone.length < 9) return;
    setLoading(true);
    // TODO: call backend to send OTP
    setTimeout(() => { setLoading(false); setPhase("otp"); }, 1200);
  }

  function handleVerify() {
    if (otp.length < 4 || !avatar) return;
    setLoading(true);
    // TODO: call backend to verify OTP and cast vote
    setTimeout(() => {
      setLoading(false);
      setPhase("success");
      setTimeout(() => { onSuccess(avatar.id); onClose(); }, 1600);
    }, 1200);
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!avatar) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="vote-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-200 flex items-center justify-center px-4"
        style={{ backgroundColor: "rgba(10,5,30,0.85)", backdropFilter: "blur(8px)" }}
        onClick={handleBackdrop}
      >
        <motion.div
          key="vote-modal-card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-sm bg-[#1a0f4e] border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Top gold accent line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-yellow-400/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          <AnimatePresence mode="wait">

            {/* ── Phase: Phone ── */}
            {phase === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
                    <Smartphone size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-100 leading-tight">Verify to Vote</p>
                    <p className="text-xs text-gray-400 mt-0.5">Voting for <span className="text-yellow-400 font-bold">{avatar.name}</span></p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
                    Mobile Number <span className="text-yellow-500/70">• දුරකථන අංකය</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-gray-300 font-semibold shrink-0 select-none">
                      <span>🇱🇰</span>
                      <span>+94</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="7X XXX XXXX"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 9 || loading}
                  className="w-full bg-linear-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-3.5 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? "SENDING OTP…" : "SEND OTP"}
                </button>

                <p className="text-center text-[10px] text-gray-600 tracking-wide">
                  One vote per day, per number.
                </p>
              </motion.div>
            )}

            {/* ── Phase: OTP ── */}
            {phase === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-100 leading-tight">Enter OTP</p>
                    <p className="text-xs text-gray-400 mt-0.5">Sent to +94 {phone}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400">
                    OTP Code <span className="text-yellow-500/70">• කේතය</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xl text-yellow-400 placeholder-gray-600 outline-none focus:border-yellow-500/50 transition-all duration-300 tracking-[0.5em] text-center font-black"
                  />
                </div>

                <button
                  onClick={handleVerify}
                  disabled={otp.length < 4 || loading}
                  className="w-full bg-linear-to-r from-yellow-400 to-amber-500 text-black text-sm font-black tracking-widest rounded-xl py-3.5 hover:brightness-110 hover:scale-[1.01] shadow-[0_4px_15px_rgba(234,179,8,0.3)] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? "VERIFYING…" : "VERIFY & VOTE"}
                </button>

                <button
                  onClick={() => { setPhase("phone"); setOtp(""); }}
                  className="w-full text-[11px] font-bold tracking-widest text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-center"
                >
                  ← Change number
                </button>
              </motion.div>
            )}

            {/* ── Phase: Success ── */}
            {phase === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} className="flex flex-col items-center gap-4 py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                >
                  <CheckCircle2 size={56} className="text-yellow-400" strokeWidth={1.5} />
                </motion.div>
                <p className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">Vote Cast!</p>
                <p className="text-sm text-gray-400">Thanks for voting for <span className="text-yellow-400 font-bold">{avatar.name}</span>!</p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTERS: { key: Filter; label: string; dot?: string }[] = [
  { key: "all",      label: "All" },
  { key: "kumara",   label: "Kumara",   dot: "bg-blue-400"  },
  { key: "kumariya", label: "Kumariya", dot: "bg-pink-400"  },
  { key: "top",      label: "Top Voted",dot: "bg-yellow-400"},
];

function AvatarCard({ avatar, voted, onVote }: { avatar: Avatar; voted: boolean; onVote: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="group relative flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-[0_15px_40px_rgba(234,179,8,0.15)]"
      style={voted ? { boxShadow: "0 0 20px rgba(234,179,8,0.2)", borderColor: "rgba(234,179,8,0.4)" } : undefined}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image
          src={avatar.img}
          alt={avatar.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay matching the new base color */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/20 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-extrabold text-gray-100 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10 shadow-md">
            #{avatar.rank}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[9px] font-extrabold tracking-widest text-white bg-gradient-to-r ${avatar.badgeColor} rounded-full px-2.5 py-1 shadow-md`}>
            {avatar.badge}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 px-4 pt-3 pb-5 relative z-10">
        <p className="text-sm font-bold text-gray-100 leading-tight drop-shadow-sm">{avatar.name}</p>
        <div className="flex items-center gap-1 text-[11px] text-gray-300 font-medium">
          <MapPin size={10} className="shrink-0 text-yellow-400" />
          <span>{avatar.flavor} · {avatar.lover}</span>
        </div>

        {/* Vote row */}
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-base font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            {avatar.votes.toLocaleString()}
            <span className="text-[10px] font-bold text-yellow-400/60 ml-1 tracking-wider uppercase">votes</span>
          </span>
          <button
            onClick={onVote}
            disabled={voted}
            className={[
              "text-[11px] font-extrabold tracking-widest rounded-full px-4 py-2 transition-all duration-300",
              voted
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 cursor-default"
                : "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:brightness-110 hover:scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)]",
            ].join(" ")}
          >
            {voted ? "✦ VOTED" : "VOTE"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8; // Increased slightly for better grid fill

export default function VotePage() {
  const [filter, setFilter]       = useState<Filter>("all");
  const [page, setPage]           = useState(1);
  const [voted, setVoted]         = useState<Set<number>>(new Set());
  const [query, setQuery]         = useState("");
  const [voteTarget, setVoteTarget] = useState<Avatar | null>(null);

  function handleVoteSuccess(id: number) {
    setVoted((prev) => new Set(prev).add(id));
  }

  const q = query.trim().toLowerCase();
  const filtered = ALL_AVATARS.filter((a) => {
    if (filter === "kumara")   if (a.type !== "kumara")   return false;
    if (filter === "kumariya") if (a.type !== "kumariya") return false;
    if (filter === "top")      if (a.votes < 1500)        return false;
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.flavor.toLowerCase().includes(q) ||
      a.lover.toLowerCase().includes(q) ||
      a.badge.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const cardVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative">
      
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

      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 pt-32 pb-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          {/* Live pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-green-400 border border-green-500/40 bg-green-500/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              VOTING IS LIVE
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 mt-2"
          >
            AI AVATAR GALLERY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" as const }}
            className="font-playfair text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-tight drop-shadow-lg"
          >
            VOTE FOR YOUR{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">FAVOURITE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg sm:text-xl font-bold text-yellow-100/90"
          >
            ඔබේ ප්‍රියතම Avatar එකට ජන්දය දෙන්න
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-xs sm:text-sm text-blue-100/60 font-medium max-w-lg mt-2"
          >
            One vote per day, per person. Top voted avatars win amazing Zellers golden hampers!
          </motion.p>
        </div>

        {/* ── Countdown ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] px-4 sm:px-8 py-8 mb-12 max-w-md mx-auto text-center shadow-2xl"
        >
          <CountdownTimer />
        </motion.div>

        {/* ── Filter Tabs ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex items-center justify-center gap-2 flex-wrap mb-10"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1); }}
              className={[
                "inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase rounded-full px-5 py-2.5 border transition-all duration-300",
                filter === f.key
                  ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md",
              ].join(" ")}
            >
              {f.dot && <span className={`w-2 h-2 rounded-full shadow-sm ${f.dot}`} />}
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── Search Bar ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative max-w-lg mx-auto mb-12"
        >
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-5 text-white/40 pointer-events-none shrink-0"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, flavor, badge…"
              className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-full pl-12 pr-12 py-3.5 text-sm text-white placeholder-white/40 tracking-wide focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 focus:ring-4 focus:ring-yellow-400/10 transition-all duration-300"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => { setQuery(""); setPage(1); }}
                  className="absolute right-4 text-white/40 hover:text-white transition-colors duration-150 bg-white/10 rounded-full p-1"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {q && (
            <p className="text-center text-[11px] font-bold tracking-widest text-yellow-400/70 mt-3 uppercase">
              {filtered.length === 0
                ? `No avatars match "${query}"`
                : `${filtered.length} avatar${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          )}
        </motion.div>

        {/* ── Avatar Grid ────────────────────────────────────────────────── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                voted={voted.has(avatar.id)}
                onVote={() => setVoteTarget(avatar)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        <div className="mt-16 flex flex-col items-center gap-4">
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-sm font-bold hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous page"
              >
                ‹
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={[
                    "w-10 h-10 flex items-center justify-center rounded-full text-xs font-extrabold tracking-widest border transition-all duration-200",
                    p === safePage
                      ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
                      : "border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white text-sm font-bold hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
          <p className="text-[11px] font-bold text-white/30 tracking-widest uppercase">
            Page {safePage} of {totalPages} · {filtered.length} entries
          </p>
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-28 flex flex-col items-center gap-5"
        >
          <p className="text-lg font-black text-white tracking-wide">
            ඔබේ Avatar එකක් නොමතිද?
          </p>
          <Link
            href="/campaign"
            className="inline-flex items-center justify-center gap-2 text-sm font-extrabold tracking-widest text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-10 py-4 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.6)] uppercase"
          >
            <span className="text-lg leading-none">+</span> CREATE YOUR AVATAR NOW
          </Link>
        </motion.div>

      </div>

      {/* ── Vote Modal ──────────────────────────────────────────────────────── */}
      <VoteModal
        avatar={voteTarget}
        onClose={() => setVoteTarget(null)}
        onSuccess={handleVoteSuccess}
      />

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-transparent border-t border-white/10 py-12 mt-auto">
        <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
              <Image
                src="/Avrudu-logo.png"
                alt="AI Avurudu with Zellers Chocolates"
                fill
                className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Vote page footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                { label: "TERMS",   href: "/terms"   },
                { label: "PRIVACY", href: "/privacy" },
                { label: "FAQ",     href: "/faq"     },
                { label: "CONTACT", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs font-bold text-white/50 hover:text-yellow-400 tracking-[0.2em] transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[10px] font-bold text-white/30 tracking-widest text-center uppercase mt-4">
            © 2026 Zellers Chocolates. All rights reserved. <br className="sm:hidden" /> Campaign subject to terms & conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}