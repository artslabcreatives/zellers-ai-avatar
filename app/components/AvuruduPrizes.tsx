"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Star } from "lucide-react";

const grandPrizes = [
  {
    id: "kumariya",
    place: "PEOPLE'S CHOICE",
    icon: Crown,
    title: "Most Popular Avurudu Kumariya",
    amount: "Rs. 75,000",
    accent: "from-pink-400 via-rose-500 to-purple-600",
    textColor: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.2)",
  },
  {
    id: "kumara",
    place: "PEOPLE'S CHOICE",
    icon: Trophy,
    title: "Most Popular Avurudu Kumara",
    amount: "Rs. 75,000",
    accent: "from-cyan-400 via-blue-500 to-indigo-600",
    textColor: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.2)",
  },
];

export default function AvuruduPrizes() {
  return (
    <section className="relative bg-transparent py-32 px-4 overflow-hidden">
      
      {/* Cinematic Background Lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent" />
        <div className="absolute w-[1000px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3"
          >
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-yellow-500">
              The Grand Celebration
            </span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            Avurudu  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Prizes</span>
          </motion.h2>
        </div>

        {/* Dual Grand Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center justify-center">
          {grandPrizes.map((prize, idx) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative group"
            >
              {/* Animated Aura Glow */}
              <div 
                className="absolute inset-0 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"
                style={{ backgroundColor: prize.glow }}
              />

              <div className="relative overflow-hidden bg-[#160E3B]/80 backdrop-blur-xl border border-white/10 group-hover:border-white/20 rounded-[2.5rem] p-8 md:p-12 text-center transition-all duration-500 hover:-translate-y-2">
                
                {/* Top Shine Effect */}
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent`} />

                {/* Icon Container */}
                <div className="relative flex justify-center mb-8">
                  <div className={`absolute inset-0 bg-gradient-to-br ${prize.accent} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <prize.icon className={`w-10 h-10 text-white`} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Label */}
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase mb-4 block ${prize.textColor}`}>
                  {prize.place}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight min-h-[4rem] flex items-center justify-center">
                  {prize.title}
                </h3>

                {/* Prize Amount Section */}
                <div className="py-8 border-y border-white/5 relative">
                  <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">Grand Prize Value</div>
                  <div className={`text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 group-hover:to-white transition-all`}>
                    {prize.amount}
                  </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className={`mt-8 h-1 w-24 mx-auto rounded-full bg-gradient-to-r ${prize.accent} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}