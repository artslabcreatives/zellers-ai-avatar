"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerLinks = [
  { label: "Terms & Conditions", href: "/terms"   },
  { label: "Privacy Policy",     href: "/privacy" },
  { label: "FAQ",                href: "/faq"     },
  { label: "Contact",            href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative bg-transparent border-t border-white/5 overflow-hidden">
      {/* Cinematic blobs — mirrors HeroSection lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-125 rounded-full bg-purple-900/40 blur-[150px]" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-105 h-105 rounded-full bg-yellow-500/12 blur-[120px]" />
      </div>

      {/* ── Final CTA Block ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20 flex flex-col items-center text-center gap-8">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400"
        >
          YOUR MOMENT AWAITS
        </motion.p>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" as const }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-100 leading-tight tracking-tight"
        >
          READY TO BECOME AN{" "}
          <span className="text-yellow-400 glow-gold">AI</span>{" "}
          <span className="text-yellow-400">
            අවුරුදු කුමාරයා / කුමාරිය?
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed"
        >
          Upload your selfie, pick your flavor, and let AI crown you the{" "}
          <span className="text-gray-300">
            Avurudu royalty you were born to be.
          </span>{" "}
          Campaign ends April 14th.
        </motion.p>

        {/* Pulsing CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" as const }}
        >
          <button
            onClick={() => window.location.href = '/campaign'}
            className="relative text-sm sm:text-base font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full px-10 py-4 hover:scale-105 transition-transform duration-200 animate-pulse"
            style={{
              boxShadow: "0 0 20px rgba(234,179,8,0.4), 0 0 50px rgba(234,179,8,0.15)",
            }}
          >
            + ENTER THE CAMPAIGN NOW
          </button>
        </motion.div>

        {/* Supporting note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="text-xs text-gray-500 tracking-widest uppercase text-gray-300"
        >
          Free to enter · Results announced April 15, 2026
        </motion.p>
      </div>

      {/* ── Divider ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
          <span className="text-white/20 text-sm">✦</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
        </div>
      </div>

      {/* ── Footer Body ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-2xl font-black tracking-widest text-yellow-400">
            Zellers
          </span>
          <span className="text-xs text-gray-400 tracking-[0.15em]">
            AI අවුරුදු · Celebrating Since 1954
          </span>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-gray-400 hover:text-yellow-400 transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center">
          <p className="text-xs text-gray-600 tracking-wide text-center">
            © 2026 Zellers Chocolates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
