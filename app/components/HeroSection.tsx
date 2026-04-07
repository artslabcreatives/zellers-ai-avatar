"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B041C] px-4 pt-24 pb-16">
      
      {/* 1. Cinematic Environment Lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10"
      >
        {/* Core center bright spot */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/40 blur-[150px]" />
        {/* Golden ambient glow */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-yellow-500/15 blur-[120px] translate-y-12" />
        
        {/* Optional: Grain overlay for a cinematic film feel */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Decorative star particles (Kept as is, they look great) */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-yellow-300/40"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${10 + ((i * 73) % 80)}%`,
            left: `${5 + ((i * 59) % 90)}%`,
            boxShadow: "0 0 8px rgba(253, 224, 71, 0.6)", // Added glow to particles
          }}
        />
      ))}

      {/* Layout Grid */}
      <div className="relative z-10 flex items-end justify-center gap-4 md:gap-12 w-full max-w-7xl mx-auto">
        
        {/* Left Avatar (Male) */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          className="hidden md:block shrink-0 relative group"
        >
          {/* Specific backlight for the character to create depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] bg-yellow-500/20 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
          
          {/* MASKING MAGIC: Fades the bottom of the image into nothingness */}
          <div className="relative w-[320px] h-[540px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <Image
              src="/avatar-4.png"
              alt="Male Avatar"
              fill
              className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" 
              priority
            />
          </div>
        </motion.div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center gap-7 flex-1 max-w-2xl px-4 z-20 pb-12">
          {/* Badge */}
          <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-yellow-300 border border-yellow-500/30 bg-[#1A0E35]/60 rounded-full px-5 py-2 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              ✦ Avurudu Subha Pathum ✦
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div custom={0.25} initial="hidden" animate="visible" variants={fadeUp} className="space-y-2">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              AI අවුරුදු
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 tracking-wide drop-shadow-lg">
              with Zellers <span className="text-yellow-400 font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">CHOCOLATES</span>
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p custom={0.4} initial="hidden" animate="visible" variants={fadeUp} className="text-lg sm:text-xl text-gray-300/90 leading-relaxed max-w-lg font-light drop-shadow-md">
            Transform into a legendary AI Avurudu Kumara or Kumariya.{" "}
            <span className="text-white font-medium">
              Let our AI reveal your royal Avurudu self — then win big!
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div custom={0.55} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-5 items-center mt-4">
            <button className="group relative overflow-hidden text-sm font-extrabold tracking-widest text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-8 py-4 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]">
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg leading-none">+</span> CREATE AVATAR සාදන්න
              </span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full ease-out" />
            </button>
            
            <button className="text-sm font-bold tracking-widest text-gray-200 border border-white/20 rounded-full px-8 py-4 hover:bg-white/5 hover:border-white/40 transition-all duration-300 backdrop-blur-md">
              VIEW GALLERY →
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div custom={0.7} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-4 text-xs tracking-[0.25em] uppercase mt-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-gray-300 font-medium">3,247 AVATARS CREATED</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-yellow-400 font-bold glow-text">VOTE IS LIVE</span>
          </motion.div>
        </div>

        {/* Right Avatar (Female) */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: "1.5s" }}
          className="hidden md:block shrink-0 relative group"
        >
          {/* Specific backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[400px] bg-purple-600/30 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
          
          {/* Masking */}
          <div className="relative w-[320px] h-[540px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <Image
              src="/avatar-3.png"
              alt="Female Avatar"
              fill
              className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}