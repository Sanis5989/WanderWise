"use client";
import React, { useEffect, useState } from "react";

// // Replace this with your actual fetch
// const fetchItinerary = async () => {
//   // Simulate loading delay
//   await new Promise((res) => setTimeout(res, 2000));
//   const res = await fetch("/api/mock-itinerary"); // replace with your endpoint
//   return await res.json();
// };

export default function ItineraryList({data}) {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchItinerary().then((data) => {
    //   setItinerary(data);
    //   setLoading(false);
    // });
    setItinerary(data?.dailyPlan);
    setLoading(false);
    console.log(data);
  }, [data]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Trip Plan</h2>

        {/* displaying trip only if itenary has been loaded */}
      {loading || !itinerary
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-6 animate-pulse space-y-4">
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))
        : itinerary.map((day, idx) => (
            <div key={idx} className="mb-8 border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-semibold text-blue-700">{day.date}</h3>
              <p className="text-gray-600 mb-4">{day.summary}</p>
              <ul className="space-y-4">
                {day.activities.map((act, i) => (
                  <li key={i} className="bg-gray-50 p-4 rounded-md border">
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{act.time}</span>
                      <span>{act.location}</span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800">{act.title}</h4>
                    <p className="text-gray-600 text-sm">{act.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
    </div>
  );
}
