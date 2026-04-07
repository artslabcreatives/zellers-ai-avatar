"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Sparkles } from "lucide-react";

const prizes = [
  {
    id: "2nd",
    place: "2ND PLACE",
    icon: Medal,
    title: "Silver Kumara / Kumariya",
    amount: "Rs. 10,000",
    perks: ["Premium Zellers Hamper", "Digital Certificate"],
    accent: "from-slate-300 to-slate-500",
    glow: "shadow-[0_0_30px_rgba(148,163,184,0.1)]",
    mobileOrder: "order-2",
    desktopOrder: "lg:order-1",
    isCenter: false,
  },
  {
    id: "1st",
    place: "GRAND WINNER",
    icon: Trophy,
    title: "AI Avurudu Raja / Rani",
    amount: "Rs. 25,000",
    perks: ["Luxury Zellers Hamper", "Digital Certificate", "Featured Spotlight"],
    accent: "from-yellow-300 via-yellow-400 to-amber-600",
    glow: "shadow-[0_0_50px_rgba(234,179,8,0.25)]",
    mobileOrder: "order-1",
    desktopOrder: "lg:order-2",
    isCenter: true,
  },
  {
    id: "3rd",
    place: "3RD PLACE",
    icon: Medal,
    title: "Bronze Kumara / Kumariya",
    amount: "Rs. 5,000",
    perks: ["Zellers Hamper", "Digital Certificate"],
    accent: "from-orange-300 to-orange-600",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.1)]",
    mobileOrder: "order-3",
    desktopOrder: "lg:order-3",
    isCenter: false,
  },
];

export default function AvuruduPrizes() {
  return (
    <section className="relative bg-transparent py-32 px-4 overflow-hidden">
      
      {/* Cinematic "God Ray" Lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 overflow-hidden">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/15 via-purple-900/5 to-transparent opacity-60" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Minimalist Premium Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-[1px] w-8 bg-yellow-500/50" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-yellow-500">
              The Royal Rewards
            </span>
            <div className="h-[1px] w-8 bg-yellow-500/50" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            AVURUDU <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">PRIZES</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-400 font-medium max-w-md mx-auto"
          >
            Claim your throne and win exclusive Zellers golden hampers.
          </motion.p>
        </div>

        {/* Monolithic Cards Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full perspective-1000">
          {prizes.map((prize, idx) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className={`
                relative group w-full flex flex-col items-center text-center rounded-[2rem]
                transition-all duration-500 hover:-translate-y-2
                ${prize.mobileOrder} ${prize.desktopOrder}
                ${prize.isCenter 
                  ? "max-w-md lg:max-w-[400px] bg-[#160E3B]/95 border border-yellow-500/40 lg:-translate-y-6 lg:hover:-translate-y-8 z-20 py-12 px-8" 
                  : "max-w-sm lg:max-w-[320px] bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] z-10 py-10 px-6"}
              `}
              style={prize.isCenter ? { boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(234,179,8,0.15)" } : {}}
            >
              
              {/* Subtle Animated Top Border Glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${prize.isCenter ? 'text-yellow-400' : 'text-white/30'}`} />

              {/* Icon / Floating Hexagon */}
              <div className="relative mb-8">
                <div className={`absolute inset-0 bg-gradient-to-br ${prize.accent} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md rotate-45 group-hover:rotate-0 transition-all duration-700">
                  <div className="-rotate-45 group-hover:rotate-0 transition-all duration-700">
                    <prize.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${prize.accent}`} strokeWidth={1.5} color="white" style={{ fill: "url(#gradient)" }} />
                  </div>
                </div>
              </div>

              {/* Place Label */}
              <p className={`text-[10px] font-black tracking-[0.4em] uppercase mb-3 ${prize.isCenter ? "text-yellow-400" : "text-gray-400"}`}>
                {prize.place}
              </p>

              {/* Title */}
              <h3 className={`font-bold leading-tight mb-8 ${prize.isCenter ? "text-2xl text-white" : "text-lg text-gray-300"}`}>
                {prize.title}
              </h3>

              {/* Value / Amount Container */}
              <div className="relative w-full py-6 mb-8 border-y border-white/5 flex flex-col items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-[0.03] ${prize.isCenter ? 'text-yellow-400' : 'text-white'}`} />
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Total Value</span>
                <p className={`font-black tracking-tight ${prize.isCenter ? "text-5xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-500" : "text-4xl text-gray-200"}`}>
                  {prize.amount}
                </p>
              </div>

              {/* Perks List */}
              <ul className="w-full space-y-4">
                {prize.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-3 text-left">
                    <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white/5">
                      <Sparkles className={`w-3 h-3 ${prize.isCenter ? "text-yellow-400" : "text-gray-500"}`} />
                    </div>
                    <span className={`text-sm font-medium ${prize.isCenter ? "text-gray-300" : "text-gray-400"}`}>
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subtle Bottom Glow on Hover */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${prize.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[2rem]`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}