"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegistrationReminder() {
  const [visible, setVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed it this session
    if (sessionStorage.getItem("hide_center_popup")) {
      setHasDismissed(true);
      return;
    }

    // 2. Use setTimeout (NOT setInterval) so it only triggers ONCE
    const timer = setTimeout(() => {
      if (!hasDismissed) setVisible(true);
    }, 12000); // Triggers after 12 seconds of browsing

    return () => clearTimeout(timer);
  }, [hasDismissed]);

  function handleClose() {
    setVisible(false);
    setHasDismissed(true);
    sessionStorage.setItem("hide_center_popup", "true");
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* ─── BLURRY BACKDROP ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#0A0515]/70 backdrop-blur-md"
            onClick={handleClose} // Closes when clicking outside
          />

          {/* ─── MODAL CARD ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-[#160A30] border border-yellow-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Dismiss"
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/60 backdrop-blur-sm transition-all duration-200"
            >
              <X size={18} />
            </button>

            {/* ─── IMAGE SECTION WITH SEAMLESS FADE ─── */}
            <div className="relative w-full h-48 sm:h-56">
              {/* Replace '/loading.jpeg' with your actual campaign/avatar image */}
              <Image
                src="/loading.jpeg" 
                alt="Avurudu Campaign"
                fill
                className="object-cover opacity-80"
              />
              {/* This gradient perfectly blends the image into the background color */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#160A30] via-[#160A30]/40 to-transparent" />
            </div>

            {/* ─── CONTENT SECTION ─── */}
            <div className="relative px-8 pb-8 pt-2 text-center z-10">
              
              {/* Floating Crown Badge (Overlaps the image slightly) */}
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] -mt-14 mb-4 border-4 border-[#160A30]">
                <Crown size={28} className="text-[#160A30] drop-shadow-sm" />
              </div>

              {/* Text Content */}
              <h3 className="font-playfair text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                Claim Your Crown
              </h3>
              <p className="text-sm text-blue-200/70 leading-relaxed max-w-[280px] mx-auto">
                Transform into a legendary AI avatar & win up to{" "}
                <span className="text-yellow-400 font-bold block mt-1 text-lg">Rs. 75,000</span>
              </p>

              {/* Call to Action Button */}
              <Link
                href="/campaign"
                onClick={handleClose} // Closes modal when navigating
                className="mt-8 flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#160A30] text-sm font-black tracking-widest uppercase rounded-xl py-4 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
              >
                ENTER THE CAMPAIGN ✦
              </Link>

              <button 
                onClick={handleClose}
                className="mt-4 text-[11px] font-bold tracking-widest text-white/30 hover:text-white/60 uppercase transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}