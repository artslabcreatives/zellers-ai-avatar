"use client";

import { motion } from "framer-motion";
import { Smartphone, Camera, Star, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Smartphone, 
    step: "01",
    title: "ලියාපදිංචි වන්න",
    subtitle: "Register",
    text: "Enter your details and verify with an OTP.",
  },
  {
    icon: Camera, 
    step: "02",
    title: "Selfie Upload කරන්න",
    subtitle: "Upload Photo",
    text: "Upload a clear front-facing photo.",
  },
  {
    icon: Star, 
    step: "03",
    title: "රස ප්‍රතිචාරය",
    subtitle: "Pick Your Flavor",
    text: "Find your favorite Zellers chocolate flavor.",
  },
  {
    icon: Sparkles, 
    step: "04",
    title: "AI Avatar අත්විඳින්න",
    subtitle: "Experience AI",
    text: "View, download, and share your royal avatar!",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative bg-transparent py-24 px-4 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[800px] h-[300px] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* Separator line */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12 opacity-60">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow-500/50" />
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>

        {/* Section header */}
        <div className="text-center mb-16 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400 drop-shadow-md"
          >
            THE JOURNEY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-100 tracking-tight leading-tight"
          >
            HOW IT WORKS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-blue-200/60 font-medium"
          >
            AI Avatar සාදා ගන්නේ කෙසේද?
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={cardVariants}
              className="group relative flex flex-col gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.06] hover:border-yellow-500/30 transition-all duration-500 cursor-default overflow-hidden shadow-xl"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

              {/* Icon & Step number */}
              <div className="flex items-center justify-between relative z-10">
                {/* UPGRADED: Transparent Premium Icon Wrapper */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-transparent backdrop-blur-md border border-white/10 text-yellow-400 group-hover:scale-110 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:bg-yellow-500/10 transition-all duration-500">
                  <step.icon strokeWidth={1.5} className="w-6 h-6 drop-shadow-md" />
                </div>
                
                {/* Massive subtle number */}
                <span className="text-6xl font-black text-white/[0.03] group-hover:text-yellow-500/10 transition-colors duration-500 leading-none select-none tracking-tighter">
                  {step.step}
                </span>
              </div>

              {/* Connector line (Desktop only) */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-14 -right-3 w-6 h-px bg-gradient-to-r from-yellow-500/30 to-transparent z-20"
                />
              )}

              {/* Content */}
              <div className="space-y-2 relative z-10 mt-2">
                <p className="text-xl font-bold text-gray-100 leading-snug group-hover:text-yellow-300 transition-colors duration-300">
                  {step.title}
                </p>
                <p className="text-xs font-bold tracking-widest uppercase text-yellow-500/80">
                  {step.subtitle}
                </p>
              </div>

              <p className="text-sm text-gray-400/90 leading-relaxed relative z-10">
                {step.text}
              </p>

              {/* Bottom accent bar that grows on hover */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-500 to-amber-300 transition-all duration-700 ease-out" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom divider */}
        <div className="flex items-center gap-4 mt-20 opacity-40">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
          <Sparkles className="w-4 h-4 text-white/40" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </section>
  );
}