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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent px-4 pt-24 pb-16">
      
      {/* Cinematic Environment Lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10"
      >
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/40 blur-[150px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-yellow-500/15 blur-[120px] translate-y-12" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Decorative star particles */}
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
            boxShadow: "0 0 8px rgba(253, 224, 71, 0.6)",
          }}
        />
      ))}

      {/* Layout Grid */}
      <div className="relative z-10 flex items-center md:items-end justify-center gap-4 md:gap-12 w-full max-w-7xl mx-auto min-h-[600px]">
        
        {/* Left Avatar (Male) - REDUCED MOBILE MARGINS */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          // Switched to a gentle -left-4 to reduce clipping without overlapping the center text
          className="absolute -left-4 sm:-left-2 top-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-y-0 md:mb-16 shrink-0 group z-0 md:z-10 opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] md:w-[220px] h-[400px] bg-yellow-500/20 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
          <div className="relative w-[180px] h-[340px] md:w-[350px] md:h-[580px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
            <Image
              src="/avatar-4.png"
              alt="Male Avatar"
              fill
              className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" 
              priority
            />
          </div>
        </motion.div>

        {/* Center Content - LIFTED UP ON DESKTOP */}
        {/* Changed md:pb-12 to md:pb-24 to act as a cushion pushing the content up on web view */}
        <div className="relative flex flex-col items-center text-center gap-6 sm:gap-7 flex-1 max-w-2xl px-2 sm:px-4 z-20 md:pb-24 mt-8 md:mt-0">
          
          <motion.div custom={0.1} initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-yellow-300 border border-yellow-400/50 bg-yellow-400/10 rounded-full px-4 sm:px-5 py-2 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              ✦ Avurudu Subha Pathum ✦
            </span>
          </motion.div>

          <motion.div custom={0.25} initial="hidden" animate="visible" variants={fadeUp} className="space-y-1 sm:space-y-2">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] pb-3">
              AI අවුරුදු
            </h1>
            <p className="text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              with Zellers <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 font-extrabold tracking-wider block sm:inline mt-1 sm:mt-0">CHOCOLATES</span>
            </p>
          </motion.div>

          <motion.p custom={0.4} initial="hidden" animate="visible" variants={fadeUp} className="text-base sm:text-xl text-blue-50/90 leading-relaxed max-w-lg font-light drop-shadow-md px-4 sm:px-0">
            Transform into a legendary AI Avurudu Kumara or Kumariya.{" "}
            <span className="text-white font-medium">
              Let our AI reveal your royal Avurudu self — then win big!
            </span>
          </motion.p>

          <motion.div custom={0.55} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center mt-2 sm:mt-4 w-full justify-center px-4 sm:px-0">
            <button className="group relative overflow-hidden w-full sm:w-auto text-sm font-extrabold tracking-widest text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full px-6 sm:px-8 py-3.5 sm:py-4 hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_30px_rgba(234,179,8,0.6)] whitespace-nowrap">
              <span className="relative z-10 flex flex-row items-center justify-center gap-2 drop-shadow-sm">
                <span className="text-xl leading-none font-medium pb-0.5">+</span>
                <span>CREATE AVATAR</span>
                <span className="font-bold text-black/70 tracking-normal text-xs bg-black/10 px-2 py-0.5 rounded-md ml-1">
                  සාදන්න
                </span>
              </span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full ease-out" />
            </button>
            <button className="w-full sm:w-auto text-sm font-bold tracking-widest text-white border-2 border-white/30 bg-white/10 rounded-full px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.1)] whitespace-nowrap">
              VIEW GALLERY →
            </button>
          </motion.div>

          <motion.div custom={0.7} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-4 w-full">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-green-500"></span>
              </span>
              <span className="text-blue-100 font-medium drop-shadow-sm">3,247 AVATARS CREATED</span>
            </div>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-yellow-400 font-bold drop-shadow-sm w-full sm:w-auto mt-1 sm:mt-0">VOTE IS LIVE</span>
          </motion.div>
        </div>

        {/* Right Avatar (Female) - REDUCED MOBILE MARGINS */}
        <motion.div
          variants={floatVariants}
          animate="animate"
          style={{ animationDelay: "1.5s" }}
          // Switched to a gentle -right-4
          className="absolute -right-4 sm:-right-2 top-1/2 -translate-y-1/2 md:relative md:right-auto md:top-auto md:translate-y-0 md:mb-16 shrink-0 group z-0 md:z-10 opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] md:w-[220px] h-[400px] bg-purple-600/30 blur-[80px] rounded-full -z-10 transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
          <div className="relative w-[180px] h-[340px] md:w-[350px] md:h-[580px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] -webkit-[mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
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