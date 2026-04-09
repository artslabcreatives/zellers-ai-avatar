"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const avatars = [
  {
    src: "/1.png",
    flavor: "PISTACHIO & KUNAFA CREAM FILLED ",
    title: "CHOCOLATE",
    alt: "Pistachio & Kunafa Cream Filled Chocolate Avatar",
  },
  {
    src: "/2.png",
    flavor: "RED VELVET COOKIE CREAM FILLED WHITE",
    title: "CHOCOLATE",
    alt: "Dark Velvet Avatar",
  },
  {
    src: "/3.png",
    flavor: "STRAWBERRY CREAM FILLED",
    title: "CHOCOLATE",
    alt: "Strawberry Cream Filled Chocolate Avatar",
  },
  {
    src: "/4.png",
    flavor: "COCONUT CREAM FILLED",
    title: "CHOCOLATE",
    alt: "Coconut Cream Filled Chocolate Avatar",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function MeetTheAvatars() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      
      {/* ─── EXPERT UI: Unified Hero Mesh Gradient Background ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#1E0B4B]" // Deep violet/indigo base
      >
        {/* Top Right Bright Cyan Glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        
        {/* Bottom Left Bright Cyan Glow */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#00E5FF]/35 blur-[120px] sm:blur-[160px]" />
        
        {/* Center/Top-Left Deep Magenta Blend */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#9D00FF]/30 blur-[140px]" />

        {/* Center/Bottom-Right Deep Purple Blend */}
        <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#6A00F4]/30 blur-[140px]" />

        {/* Subtle Central Golden ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-500/10 blur-[100px]" />

        {/* Grain overlay for cinematic film feel */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 drop-shadow-md"
          >
            COMMUNITY SHOWCASE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-gray-100 tracking-tight leading-tight"
          >
           Meet your Zellers AI අවුරුදු කුමරා and අවුරුදු කුමරිය
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-blue-200/60 font-medium"
          >
            The royals have arrived — are you next?
          </motion.p>
        </div>

        {/* Gallery grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.flavor}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xl"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-white/5">
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E0B4B]/95 via-[#1E0B4B]/40 to-transparent pointer-events-none" />

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-400/80 mb-0.5">
                  {avatar.flavor}
                </p>
                <p className="text-base font-bold text-gray-100 leading-snug drop-shadow-sm">
                  {avatar.title}
                </p>
                {/* Vote bar */}
                <div className="mt-3 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex-1 text-xs font-bold tracking-widest text-black bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full py-1.5 hover:brightness-110 transition-all duration-200 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    VOTE ✦
                  </button>
                </div>
              </div>

              {/* Gold border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-yellow-400/50 transition-all duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link href="/vote" className="text-sm font-bold tracking-widest text-yellow-400 border border-yellow-500/40 rounded-full px-10 py-3 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 backdrop-blur-sm shadow-[0_0_20px_rgba(234,179,8,0.1)]">
            VIEW FULL GALLERY →
          </Link>
        </motion.div>

        {/* Bottom separator */}
        <div className="flex items-center gap-4 mt-16 opacity-40">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-white/40 text-sm">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </section>
  );
}