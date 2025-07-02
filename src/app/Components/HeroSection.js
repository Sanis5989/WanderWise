'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UseCases from './UseCases';
import { useRouter } from 'next/navigation';

const images = ['/hero1.jpg', '/hero2.jpg'];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  // Auto change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className=" py-16 max-w-[75%] mx-auto">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Your Smart Travel Companion
          </h1>
          <h2 className="text-2xl text-primary">Powered by AI</h2>
          <p className="text-secondary-foreground max-w-md">
            Plan trips in seconds – from flights to daily adventures. Wanderwise builds your perfect travel experience powered by the latest AI.
          </p>
          <button onClick={()=>router.push("./Trip")} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 cursor-pointer">
            Plan My Trip
          </button>
        </motion.div>

        {/* Image Carousel */}
        <div className="w-[400px] h-[200px] relative md:w-[850px] md:h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={images[index]}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={images[index]}
                fill
                alt={`Hero ${index + 1}`}
                className="object-cover rounded-xl shadow-xl"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition ${
                  i === index ? 'bg-blue-600' : 'bg-white/60'
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div> */}
        </div>
      </div>
      
    </div>

    
    </>
  );
}
