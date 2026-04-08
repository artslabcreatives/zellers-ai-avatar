"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, X } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "hide_registration_reminder";

export default function RegistrationReminder() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    function onScroll() {
      if (window.scrollY > 600) {
        setVisible(true);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClose() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 sm:right-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 z-50 w-[calc(100vw-3rem)] max-w-sm">
          {/* Glowing aura */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-yellow-500/20 blur-2xl -z-10"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#160A30]/90 backdrop-blur-xl border border-yellow-500/30 rounded-2xl px-5 py-5 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Dismiss"
              className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              {/* Crown icon */}
              <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-[0_0_16px_rgba(234,179,8,0.5)]">
                <Crown size={20} className="text-[#160A30]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-playfair text-base font-normal text-white leading-snug">
                  Claim Your Crown
                </p>
                <p className="text-xs text-blue-200/60 mt-0.5 leading-relaxed">
                  Transform into a royal AI avatar &amp; win up to{" "}
                  <span className="text-yellow-400 font-semibold">Rs.&nbsp;75,000</span> in prizes.
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/campaign"
              className="mt-4 flex items-center justify-center w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-[#160A30] text-xs font-black tracking-widest uppercase rounded-xl py-2.5 hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150 shadow-[0_0_20px_rgba(234,179,8,0.35)]"
            >
              Enter the Campaign →
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
