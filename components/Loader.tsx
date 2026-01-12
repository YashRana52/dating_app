"use client";
import { motion } from "framer-motion";
import { LOADER_SIZE_CLASSES } from "@/lib/common-utils";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const Loader = ({ message = "Loading...", size = "md" }: LoaderProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 backdrop-blur-sm z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-50"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, -180],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Loader Container */}
      <motion.div
        className="relative z-10 text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl max-w-sm mx-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Modern Spinner */}
        <motion.div
          className="relative mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <div
            className={`relative ${LOADER_SIZE_CLASSES[size]} mx-auto border-4 border-gray-200/30 rounded-full`}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-pink-400 border-t-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner Pulsing Core */}
            <motion.div
              className="absolute inset-0 m-auto w-1/2 h-1/2 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-full blur-sm opacity-80"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-white text-xl md:text-2xl font-medium tracking-wide bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {/* Dots Animation */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Progress Ring (Optional subtle effect) */}
        <svg className="absolute -inset-4 opacity-30" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="1"
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

export default Loader;
