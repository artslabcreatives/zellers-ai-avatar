"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const avatars = [
  {
    src: "/1.png",
    flavor: "MINT CHOCOLATE",
    title: "The Green Spirit",
    alt: "Mint Chocolate Avatar",
  },
  {
    src: "/2.png",
    flavor: "DARK VELVET",
    title: "The Shadow Prince",
    alt: "Dark Velvet Avatar",
  },
  {
    src: "/3.png",
    flavor: "GOLDEN CARAMEL",
    title: "The Sun Rani",
    alt: "Golden Caramel Avatar",
  },
  {
    src: "/4.png",
    flavor: "CHERRY BLISS",
    title: "The Rose Kumariya",
    alt: "Cherry Bliss Avatar",
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
    <section className="relative bg-[#0B041C] py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-225 h-75 rounded-full bg-yellow-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400"
          >
            COMMUNITY SHOWCASE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-100 tracking-tight leading-tight"
          >
            MEET THE AVATARS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-gray-400"
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
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
            >
              {/* Image */}
              <div className="relative w-full aspect-4/5 overflow-hidden">
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0B041C]/95 via-[#0B041C]/30 to-transparent pointer-events-none" />

              {/* Top badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-400 bg-yellow-500/15 border border-yellow-500/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                  {avatar.flavor}
                </span>
              </div>

              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-yellow-400/70 mb-0.5">
                  {avatar.flavor}
                </p>
                <p className="text-base font-bold text-gray-100 leading-snug">
                  {avatar.title}
                </p>
                {/* Vote bar */}
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex-1 text-xs font-bold tracking-widest text-black bg-linear-to-r from-yellow-500 to-amber-400 rounded-full py-1.5 hover:brightness-110 transition-all duration-200">
                    VOTE ✦
                  </button>
                </div>
              </div>

              {/* Gold border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-yellow-500/30 transition-all duration-300 pointer-events-none" />
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
          <button className="text-sm font-bold tracking-widest text-yellow-400 border border-yellow-500/40 rounded-full px-10 py-3 hover:bg-yellow-500/10 hover:border-yellow-400 transition-all duration-200 backdrop-blur-sm">
            VIEW FULL GALLERY →
          </button>
        </motion.div>

        {/* Bottom separator */}
        <div className="flex items-center gap-4 mt-16">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
          <span className="text-white/20 text-sm">✦</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
        </div>
      </div>
    </section>
  );
}
