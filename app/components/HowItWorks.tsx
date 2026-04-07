"use client";

import { motion } from "framer-motion";

const steps = [
  {
    icon: "📱",
    step: "01",
    title: "ලියාපදිංචි වන්න",
    subtitle: "Register",
    text: "Enter your details and verify with an OTP.",
  },
  {
    icon: "🤳",
    step: "02",
    title: "Selfie Upload කරන්න",
    subtitle: "Upload Photo",
    text: "Upload a clear front-facing photo.",
  },
  {
    icon: "🍫",
    step: "03",
    title: "රස ප්‍රතිචාරය",
    subtitle: "Pick Your Flavor",
    text: "Find your favorite Zellers chocolate flavor.",
  },
  {
    icon: "✨",
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
        <div className="w-225 h-75 rounded-full bg-purple-900/30 blur-[100px]" />
      </div>

      {/* Separator line */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-yellow-500/40" />
          <span className="text-yellow-400/60 text-xl">✦</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-yellow-500/40" />
        </div>

        {/* Section header */}
        <div className="text-center mb-16 space-y-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.4em] uppercase text-yellow-400"
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
            className="text-base sm:text-lg text-gray-400 font-medium"
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
              className="group relative flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300 cursor-default overflow-hidden"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-yellow-500/5 to-purple-700/5 pointer-events-none" />

              {/* Step number */}
              <div className="flex items-center justify-between">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-5xl font-black text-white/5 group-hover:text-yellow-500/15 transition-colors duration-300 leading-none select-none">
                  {step.step}
                </span>
              </div>

              {/* Connector line (not on last card) */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-10 -right-2.5 w-5 h-px bg-linear-to-r from-yellow-500/40 to-transparent z-20"
                />
              )}

              {/* Content */}
              <div className="space-y-1.5 relative z-10">
                <p className="text-lg font-bold text-gray-100 leading-snug group-hover:text-yellow-300 transition-colors duration-200">
                  {step.title}
                </p>
                <p className="text-xs font-semibold tracking-widest uppercase text-yellow-500/60">
                  {step.subtitle}
                </p>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                {step.text}
              </p>

              {/* Bottom accent */}
              <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-yellow-500/60 to-transparent transition-all duration-500 rounded-full" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom divider */}
        <div className="flex items-center gap-4 mt-16">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/10" />
          <span className="text-white/20 text-sm">✦</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/10" />
        </div>
      </div>
    </section>
  );
}
