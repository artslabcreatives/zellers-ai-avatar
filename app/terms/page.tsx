"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Link from "next/link";

const SECTIONS = [
  {
    title: "1. Eligibility",
    body: "The Zellers AI Avurudu Campaign is open to residents of Sri Lanka aged 18 and above. Employees of Zellers Chocolates and their immediate family members are not eligible to participate.",
  },
  {
    title: "2. Campaign Period",
    body: "The campaign runs from April 1, 2026 to April 14, 2026 at 23:59 SLST. Entries submitted after the closing time will not be considered.",
  },
  {
    title: "3. How to Enter",
    body: "Participants must verify their mobile number, complete their profile, answer the quiz, and generate an AI avatar. All steps must be completed for an entry to be valid.",
  },
  {
    title: "4. Voting",
    body: "Each verified participant may cast one vote per day. Votes cannot be transferred. Zellers reserves the right to disqualify entries suspected of fraudulent voting activity.",
  },
  {
    title: "5. Prizes",
    body: "Prizes are non-transferable and cannot be exchanged for cash. Winners will be announced on April 15, 2026 via official Zellers social media channels and contacted directly.",
  },
  {
    title: "6. Intellectual Property",
    body: "By submitting an entry, participants grant Zellers Chocolates a royalty-free, worldwide licence to use their generated avatar image for promotional purposes.",
  },
  {
    title: "7. Disqualification",
    body: "Zellers reserves the right to disqualify any participant who tampers with the entry process, acts in an unsportsmanlike manner, or violates any of these terms.",
  },
  {
    title: "8. Governing Law",
    body: "These terms are governed by the laws of Sri Lanka. Any disputes will be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Navbar />

      {/* Ambient blobs — hero palette */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-900/40 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 rounded-full bg-yellow-500/10 blur-[120px]" />
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-32 pb-24">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="text-center mb-14"
        >
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-yellow-400/60 mb-3">
            LEGAL
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-100 tracking-tight">
            Terms &amp; <span className="text-yellow-400">Conditions</span>
          </h1>
          <p className="text-sm text-gray-500 mt-3">Last updated: April 1, 2026</p>
        </motion.div>

        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" as const }}
              className="bg-purple-950/30 border border-purple-500/15 rounded-2xl px-6 py-5 backdrop-blur-sm"
            >
              <h2 className="text-sm font-extrabold text-yellow-400 tracking-wide mb-2">{s.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 border-t border-purple-500/15 pt-8 flex flex-col items-center gap-4"
        >
          <nav aria-label="Page footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li><Link href="/" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">HOME</Link></li>
              <li><span className="text-white/20 text-xs">·</span></li>
              <li><Link href="/terms" className="text-[11px] font-bold tracking-widest text-yellow-400/80 hover:text-yellow-400 transition-colors duration-200">TERMS</Link></li>
              <li><span className="text-white/20 text-xs">·</span></li>
              <li><Link href="/privacy" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">PRIVACY</Link></li>
              <li><span className="text-white/20 text-xs">·</span></li>
              <li><Link href="/faq" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">FAQ</Link></li>
              <li><span className="text-white/20 text-xs">·</span></li>
              <li><Link href="/contact" className="text-[11px] font-bold tracking-widest text-gray-400 hover:text-yellow-400 transition-colors duration-200">CONTACT</Link></li>
            </ul>
          </nav>
          <p className="text-[10px] text-gray-600 tracking-wide">© 2026 Zellers Chocolates. All rights reserved.</p>
        </motion.div>
      </main>
    </div>
  );
}
