"use client";

import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyActivitiesContext } from "../Trip/page";

export default function EventSwiper() {
  const { events, loadingG } = useContext(DailyActivitiesContext);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("next"); // Track navigation direction

  // Animation variants for next/previous
  const variants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === "next" ? 100 : -100, // Right for next, left for prev
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === "next" ? -100 : 100, // Left for next, right for prev
    }),
  };

  const handlePrev = () => {
    setDirection("prev");
    setIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  };

  const handleNext = () => {
    setDirection("next");
    setIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <>
      {events.length >= 1 ? (
        <div className="relative mx-auto m-4">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events in {localStorage.getItem("destination")}</h2>
          {/* Container for buttons, moved outside motion.div for stable positioning */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10">
            <button
              onClick={handlePrev}
              aria-label="Previous event"
              className="rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer glow-effect"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next event"
              className="rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer glow-effect"
            >
              <ChevronRight size={30} />
            </button>
          </div>
          <motion.div
            key={index}
            variants={variants}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            custom={direction}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-[550px]" // Fixed height
          >
            {events[index]?.image && (
              <img
                src={events[index].image}
                alt={events[index].title}
                className="w-full h-64 object-cover" // Fixed image height
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold">{events[index].title}</h3>
              <p className="text-sm text-gray-500">{events[index].date?.when}</p>
              <p className="mt-2 text-gray-700 line-clamp-3">{events[index].description}</p>
              <p className="text-sm text-gray-500 mt-2">{events[index].venue?.name}</p>
              <p className="text-sm text-gray-500">{events[index].address?.join(", ")}</p>
              <a
                href={events[index].link}
                target="_blank"
                className="flex mt-auto"
                rel="noreferrer w-full items-end"
              >
                <button className="bg-primary mt-4 px-4 py-2 text-background rounded-md ml-auto cursor-pointer">
                  View Event
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}