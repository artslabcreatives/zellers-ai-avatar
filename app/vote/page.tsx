"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, X } from "lucide-react";
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

// ─── Countdown hook ───────────────────────────────────────────────────────────
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
  const { days, hours, minutes, seconds } = useCountdown(TARGET_DATE);
  const units = [
    { label: "HOURS",   value: hours },
    { label: "MINUTES", value: minutes },
    { label: "SECONDS", value: seconds },
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-black text-gray-100 tabular-nums w-14 text-center">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-gray-500 mt-0.5">{u.label}</span>
            </div>
            {i < units.length - 1 && (
              <span className="text-2xl font-black text-gray-600 mb-4 mx-0.5">:</span>
            )}
          </div>
        ))}
        {/* separator */}
        <span className="text-2xl font-black text-gray-600 mb-4 mx-1">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-black text-gray-100 tabular-nums w-14 text-center">
            {String(days).padStart(2, "0")}
          </span>
          <span className="text-[9px] tracking-[0.2em] text-gray-500 mt-0.5">DAYS</span>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTERS: { key: Filter; label: string; dot?: string }[] = [
  { key: "all",      label: "All" },
  { key: "kumara",   label: "Kumara",   dot: "bg-blue-400"  },
  { key: "kumariya", label: "Kumariya", dot: "bg-pink-400"  },
  { key: "top",      label: "Top Voted",dot: "bg-yellow-400"},
];

// ─── Avatar Card ──────────────────────────────────────────────────────────────
function AvatarCard({ avatar, voted, onVote }: { avatar: Avatar; voted: boolean; onVote: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="group relative flex flex-col bg-[#0D0B38]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-300"
      style={voted ? { boxShadow: "0 0 20px rgba(234,179,8,0.12)" } : undefined}
    >
      {/* Image */}
      <div className="relative w-full aspect-4/5 overflow-hidden">
        <Image
          src={avatar.img}
          alt={avatar.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0D0B38]/95 via-[#0D0B38]/20 to-transparent" />

        {/* Rank badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-extrabold text-gray-100 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
            #{avatar.rank}
          </span>
        </div>

        {/* Type badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-[9px] font-extrabold tracking-widest text-white bg-linear-to-r ${avatar.badgeColor} rounded-full px-2.5 py-1`}>
            {avatar.badge}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
        <p className="text-sm font-bold text-gray-100 leading-tight">{avatar.name}</p>
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <MapPin size={10} className="shrink-0" />
          <span>{avatar.flavor} · {avatar.lover}</span>
        </div>

        {/* Vote row */}
        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="text-base font-black text-yellow-400">
            {avatar.votes.toLocaleString()}
            <span className="text-[10px] font-normal text-yellow-400/60 ml-1">votes</span>
          </span>
          <button
            onClick={onVote}
            disabled={voted}
            className={[
              "text-[11px] font-extrabold tracking-widest rounded-full px-3 py-1.5 transition-all duration-200",
              voted
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 cursor-default"
                : "bg-linear-to-r from-yellow-500 to-amber-400 text-black hover:brightness-110 hover:scale-105",
            ].join(" ")}
          >
            {voted ? "✦ Voted!" : "Vote"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 6;

export default function VotePage() {
  const [filter, setFilter]     = useState<Filter>("all");
  const [shown, setShown]       = useState(PAGE_SIZE);
  const [voted, setVoted]       = useState<Set<number>>(new Set());
  const [query, setQuery]       = useState("");

  function handleVote(id: number) {
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

  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;

  const cardVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-75 rounded-full bg-purple-800/15 blur-[140px]" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full bg-yellow-700/8 blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 pt-28 pb-20">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          {/* Live pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] uppercase text-green-400 border border-green-500/40 bg-green-500/10 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              VOTING IS LIVE
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-[10px] font-bold tracking-[0.35em] uppercase text-yellow-400/60"
          >
            AI AVATAR GALLERY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" as const }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-100 tracking-tight leading-tight"
          >
            VOTE FOR YOUR{" "}
            <span className="text-yellow-400">FAVOURITE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xl font-bold text-yellow-400"
          >
            ඔබේ ප්‍රියතම Avatar එකට ජන්දය දෙන්න
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-xs text-gray-500 italic"
          >
            One vote per day, per person. Top voted avatars win amazing prizes!
          </motion.p>
        </div>

        {/* ── Countdown ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white/4 border border-white/10 rounded-2xl px-6 py-6 mb-10 max-w-sm mx-auto text-center"
        >
          <CountdownTimer />
        </motion.div>

        {/* ── Filter Tabs ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex items-center justify-center gap-2 flex-wrap mb-8"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setShown(PAGE_SIZE); }}
              className={[
                "inline-flex items-center gap-1.5 text-xs font-bold tracking-widest rounded-full px-4 py-1.5 border transition-all duration-200",
                filter === f.key
                  ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-400"
                  : "bg-white/4 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300",
              ].join(" ")}
            >
              {f.dot && <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />}
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── Search Bar ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative max-w-md mx-auto mb-8"
        >
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-4 text-gray-500 pointer-events-none shrink-0"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShown(PAGE_SIZE); }}
              placeholder="Search by name, flavor, badge…"
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-gray-200 placeholder-gray-600 tracking-wide focus:outline-none focus:border-yellow-500/50 focus:bg-white/8 transition-all duration-200"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => { setQuery(""); setShown(PAGE_SIZE); }}
                  className="absolute right-3.5 text-gray-500 hover:text-gray-300 transition-colors duration-150"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {q && (
            <p className="text-center text-[11px] text-gray-600 mt-2 tracking-wide">
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                voted={voted.has(avatar.id)}
                onVote={() => handleVote(avatar.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more */}
        <div className="mt-10 flex flex-col items-center gap-3">
          {hasMore && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShown((s) => s + PAGE_SIZE)}
              className="text-sm font-bold tracking-widest text-gray-300 border border-white/15 rounded-full px-8 py-3 hover:bg-white/5 hover:border-white/25 transition-all duration-200"
            >
              LOAD MORE AVATARS
            </motion.button>
          )}
          <p className="text-xs text-gray-600 tracking-wide">
            Showing {visible.length} of {filtered.length} entries
          </p>
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <p className="text-base font-bold text-gray-300">
            ඔබේ Avatar එකක් නොමතිද?
          </p>
          <Link
            href="/campaign"
            className="inline-flex items-center gap-2 text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full px-8 py-3.5 hover:brightness-110 hover:scale-105 transition-all duration-200"
            style={{ boxShadow: "0 0 16px rgba(234,179,8,0.25)" }}
          >
            + CREATE YOUR AVATAR NOW
          </Link>
        </motion.div>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-transparent border-t border-purple-500/15 py-10">
        {/* Blob glow matching page palette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-40 rounded-full bg-purple-900/30 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center gap-5">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-black tracking-widest text-yellow-400">Zellers</span>
            <span className="text-xs text-gray-500 tracking-[0.15em]">AI අවුරුදු · Celebrating Since 1964</span>
          </div>

          {/* Links */}
          <nav aria-label="Vote page footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { label: "TERMS",   href: "/terms"   },
                { label: "PRIVACY", href: "/privacy" },
                { label: "FAQ",     href: "/faq"     },
                { label: "CONTACT", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[11px] text-gray-500 hover:text-yellow-400 tracking-widest transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[11px] text-gray-600 tracking-wide text-center">
            © 2026 Zellers Chocolates. All rights reserved. · Campaign subject to terms & conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}
