"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const floatVariants = {
  animate: {
    y: [0, -14, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B041C] px-4 pt-24 pb-16">
      {/* Radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-175 h-175 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute w-100 h-100 rounded-full bg-yellow-500/10 blur-[80px]" />
      </div>

      {/* Decorative star particles */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-yellow-300/30"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${10 + ((i * 73) % 80)}%`,
            left: `${5 + ((i * 59) % 90)}%`,
          }}
        />
      ))}

      {/* Layout: left avatar | center content | right avatar */}
      <div className="relative z-10 flex items-end justify-center gap-0 md:gap-8 w-full max-w-6xl mx-auto">
        {/* Left Avatar */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="hidden md:block shrink-0 relative"
        >
          <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-yellow-500/20 to-transparent blur-xl" />
          <Image
            src="/avatar-4.png"
            alt="Male Avatar"
            width={260}
            height={440}
            className="rounded-2xl object-cover border border-white/10 shadow-2xl relative"
            priority
          />
        </motion.div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center gap-6 flex-1 max-w-2xl px-4">
          {/* Badge */}
          <motion.div
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-yellow-400 border border-yellow-500/40 bg-yellow-500/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
              ✦ Avurudu Subha Pathum ✦
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            custom={0.25}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-1"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight glow-gold text-yellow-400">
              AI අවුරුදු
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-200 tracking-wide">
              with Zellers{" "}
              <span className="text-yellow-400 font-extrabold">CHOCOLATES</span>
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            custom={0.4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-lg"
          >
            Transform into a legendary AI Avurudu Kumara or Kumariya.{" "}
            <span className="text-gray-300">
              Let our AI reveal your royal Avurudu self — then win big!
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={0.55}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <button className="group relative overflow-hidden text-sm font-extrabold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full px-8 py-3.5 hover:scale-105 transition-transform duration-200 glow-gold-box shadow-lg">
              <span className="relative z-10">+ create AVATAR සාදන්න</span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
            </button>
            <button className="text-sm font-bold tracking-widest text-yellow-400 border border-yellow-500/50 rounded-full px-8 py-3.5 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 backdrop-blur-sm">
              VIEW GALLERY →
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={0.7}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-400">
              3,247 AVATARS CREATED
            </span>
            <span className="text-yellow-500/60">—</span>
            <span className="text-yellow-400 font-semibold">VOTE IS LIVE</span>
          </motion.div>
        </div>

        {/* Right Avatar */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: "1s" }}
          className="hidden md:block shrink-0 relative"
          transition={{ delay: 0.8 }}
        >
          <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-purple-600/20 to-transparent blur-xl" />
          <Image
            src="/avatar-3.png"
            alt="Female Avatar"
            width={260}
            height={440}
            className="rounded-2xl object-cover border border-white/10 shadow-2xl relative"
            priority
          />
        </motion.div>
      </div>

      {/* Mobile avatars row */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-between pointer-events-none opacity-30">
        <Image
          src="https://via.placeholder.com/300x500/1a1a2e/ffffff?text=Male+Avatar"
          alt=""
          width={120}
          height={200}
          className="rounded-tr-2xl object-cover"
        />
        <Image
          src="https://via.placeholder.com/300x500/1a1a2e/ffffff?text=Female+Avatar"
          alt=""
          width={120}
          height={200}
          className="rounded-tl-2xl object-cover"
        />
      </div>
    </section>
  );
}
