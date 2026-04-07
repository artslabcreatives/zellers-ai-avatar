"use client";

import { motion } from "framer-motion";

const prizes = [
  {
    place: "3RD PLACE",
    medal: "🥉",
    medalLabel: "Bronze",
    title: "Bronze Kumara / Kumariya",
    amount: "Rs. 5,000",
    perks: ["Zellers Chocolate Hamper", "Digital Certificate"],
    highlight: false,
    delay: 0.2,
    scale: "origin-bottom",
  },
  {
    place: "GRAND WINNER",
    medal: "🥇",
    medalLabel: "Gold",
    title: "AI Avurudu Raja / Rani",
    amount: "Rs. 25,000",
    perks: ["Luxury Zellers Hamper", "Digital Certificate", "Featured Spotlight"],
    highlight: true,
    delay: 0,
    scale: "origin-bottom",
  },
  {
    place: "2ND PLACE",
    medal: "🥈",
    medalLabel: "Silver",
    title: "Silver Kumara / Kumariya",
    amount: "Rs. 10,000",
    perks: ["Premium Zellers Hamper", "Digital Certificate"],
    highlight: false,
    delay: 0.2,
    scale: "origin-bottom",
  },
];

export default function AvuruduPrizes() {
  return (
    <section className="relative bg-transparent py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-175 h-175 rounded-full bg-yellow-700/10 blur-[140px]" />
        <div className="absolute w-100 h-100 rounded-full bg-purple-900/20 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400"
          >
            WIN BIG
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-100 tracking-tight leading-tight"
          >
            AVURUDU PRIZES
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xl font-semibold text-yellow-400/80"
          >
            ත්‍යාග
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-gray-400 max-w-lg mx-auto"
          >
            Top voted AI Avatars will claim the Zellers golden hamper
          </motion.p>
        </div>

        {/* Podium layout — side cards align to bottom of center */}
        <div className="flex items-end justify-center gap-4 sm:gap-6">
          {prizes.map((prize) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: prize.delay,
                ease: "easeOut" as const,
              }}
              className={[
                "relative flex flex-col items-center text-center rounded-2xl p-6 sm:p-8 border transition-all duration-300",
                "bg-[#0D0B40]/80 border-white/10",
                prize.highlight
                  ? [
                      "flex-[1.35] min-w-0 sm:min-w-65",
                      "border-yellow-500/50",
                    ].join(" ")
                  : "flex-1 min-w-0 sm:min-w-45 opacity-90",
              ].join(" ")}
              style={
                prize.highlight
                  ? { boxShadow: "0 0 40px rgba(234,179,8,0.18), 0 0 80px rgba(234,179,8,0.08)" }
                  : undefined
              }
            >
              {/* Grand winner crown badge */}
              {prize.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-black bg-linear-to-r from-yellow-400 to-amber-300 rounded-full px-4 py-1 shadow-lg whitespace-nowrap">
                    ✦ CHAMPION ✦
                  </span>
                </div>
              )}

              {/* Medal */}
              <div
                className={[
                  "mb-4",
                  prize.highlight ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl",
                ].join(" ")}
              >
                {prize.medal}
              </div>

              {/* Place label */}
              <p
                className={[
                  "font-extrabold tracking-[0.25em] uppercase mb-1",
                  prize.highlight
                    ? "text-sm sm:text-base text-yellow-400"
                    : "text-xs sm:text-sm text-gray-400",
                ].join(" ")}
              >
                {prize.place}
              </p>

              {/* Title */}
              <p
                className={[
                  "font-bold leading-snug mb-5",
                  prize.highlight
                    ? "text-lg sm:text-xl text-gray-100 glow-gold"
                    : "text-sm sm:text-base text-gray-300",
                ].join(" ")}
              >
                {prize.title}
              </p>

              {/* Divider */}
              <div
                className={[
                  "h-px w-full mb-5",
                  prize.highlight
                    ? "bg-linear-to-r from-transparent via-yellow-500/50 to-transparent"
                    : "bg-white/10",
                ].join(" ")}
              />

              {/* Amount */}
              <p
                className={[
                  "font-black text-yellow-400 leading-none mb-5",
                  prize.highlight ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
                ].join(" ")}
              >
                {prize.amount}
              </p>

              {/* Perks */}
              <ul className="space-y-2 w-full">
                {prize.perks.map((perk) => (
                  <li
                    key={perk}
                    className={[
                      "flex items-center gap-2 text-left rounded-lg px-3 py-2",
                      prize.highlight
                        ? "bg-yellow-500/10 text-gray-200 text-sm"
                        : "bg-white/5 text-gray-400 text-xs",
                    ].join(" ")}
                  >
                    <span
                      className={
                        prize.highlight ? "text-yellow-400" : "text-gray-500"
                      }
                    >
                      ✦
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom separator */}
        <div className="flex items-center gap-4 mt-20">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
          <span className="text-white/20 text-sm">✦</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
        </div>
      </div>
    </section>
  );
}
