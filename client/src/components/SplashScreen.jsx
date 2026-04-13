import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);

      setTimeout(() => {
        navigate("/login");
      }, 500); // allow fade-out animation
    }, 1500); // splash visible for 1.5 sec

    return () => clearTimeout(timer);
  }, [navigate]);

  const DotLoader = () => {
    return (
      <div className="flex gap-3 mt-4">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-3 h-3 rounded-full bg-[#E21B2F]"
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center text-center px-4">

            {/* Logo */}
            <motion.img
              src="/Untitled design.png"
              alt="BloodLink Logo"
              className="w-[220px] md:w-[260px] lg:w-[300px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />

            {/* Loader */}
            <DotLoader />

            {/* Text */}
            <motion.p
              className="mt-4 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Connecting to BloodLink...
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;