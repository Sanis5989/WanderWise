// components/EventSwiper.tsx
"use client";

import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyActivitiesContext } from "../Trip/page";



export default function EventSwiper() {

   const {events ,loadingG} =useContext(DailyActivitiesContext)

  console.log("events")
  const [index, setIndex] = useState(0);

  const handlePrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : events.length - 1));
  const handleNext = () => setIndex((prev) => (prev + 1) % events.length);

  return (
    <>
        {
            events.length >= 1 && !loadingG? <div className="relative max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-2">
            <button onClick={handlePrev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronLeft />
            </button>
            <h2 className="text-xl font-bold">Upcoming Events</h2>
            <button onClick={handleNext} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <ChevronRight />
            </button>
        </div>

        <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row"
        >
            {events[index]?.image && (
            <img
                src={events[index].image}
                alt={events[index].title}
                className="w-full md:w-1/3 h-64 object-cover"
            />
            )}

            <div className="p-4 flex-1">
            <h3 className="text-xl font-semibold">{events[index].title}</h3>
            <p className="text-sm text-gray-500">{events[index].date?.when}</p>
            <p className="mt-2 text-gray-700 line-clamp-3">{events[index].description}</p>
            <p className="text-sm text-gray-500 mt-2">{events[index].venue?.name}</p>
            <p className="text-sm text-gray-500">
                {events[index].address?.join(", ")}
            </p>

            <a
                href={events[index].link}
                target="_blank"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                rel="noreferrer"
            >
                View Event
            </a>
            </div>
        </motion.div>
        </div> 
        :
        <> </>

            
        }
        
    </>
    
  );
}
