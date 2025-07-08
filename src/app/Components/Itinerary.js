"use client";
import React, { useContext, useEffect, useState } from "react";
import FlightCard from "./FlightCard";
import { DailyActivitiesContext } from "../Trip/page";
import HotelList from "./HotelList";
import { ChevronDown, ChevronUp } from "lucide-react"; 
import EventSwiper from "./EventSwiper";
import FeaturedCards from "./FeaturedCards";
import { AnimatePresence,motion } from "framer-motion";

export default function ItineraryList({data,flightData ,hotel}) {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempFlight, setTempFlight] =useState();
  
  
  const {loadingG, events} = useContext(DailyActivitiesContext)

  const [openIndex, setOpenIndex] = useState(0); // default to first day

  const toggleDay = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };


  useEffect(() => {
  //   const dummdata = [
  //   {
  //     "date": "2025-06-29",
  //     "summary": "Arrival in Brisbane and exploring the South Bank",
  //     "activities": [
  //       {
  //         "time": "15:00",
  //         "title": "Check-in at Hotel",
  //         "description": "Settle into your hotel in Brisbane.",
  //         "location": "Downtown Brisbane Hotel"
  //       },
  //       {
  //         "time": "16:00",
  //         "title": "Visit South Bank Parklands",
  //         "description": "Stroll through the beautiful gardens and enjoy the riverside views.",
  //         "location": "South Bank, Brisbane"
  //       },
  //       {
  //         "time": "18:00",
  //         "title": "Dinner at Eat Street Northshore",
  //         "description": "Experience a variety of food stalls offering local and international cuisines.",
  //         "location": "Northshore, Brisbane"
  //       },
  //       {
  //         "time": "20:00",
  //         "title": "Explore Brisbane's Nightlife",
  //         "description": "Enjoy live music and drinks at local bars.",
  //         "location": "Fortitude Valley"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2025-06-30",
  //     "summary": "Cultural immersion and sightseeing",
  //     "activities": [
  //       {
  //         "time": "09:00",
  //         "title": "Brisbane City Botanic Gardens",
  //         "description": "Relax and explore the gardens filled with native and exotic plants.",
  //         "location": "Botanic Gardens, Brisbane"
  //       },
  //       {
  //         "time": "11:00",
  //         "title": "Visit Queensland Art Gallery and Gallery of Modern Art (QAGOMA)",
  //         "description": "Discover Australian and international art collections.",
  //         "location": "Cultural Centre, Brisbane"
  //       },
  //       {
  //         "time": "13:00",
  //         "title": "Lunch at Felix Espresso",
  //         "description": "Enjoy a delicious brunch at this popular café.",
  //         "location": "Brisbane CBD"
  //       },
  //       {
  //         "time": "15:00",
  //         "title": "Take a River Cruise",
  //         "description": "Enjoy views of the city skyline from the Brisbane River.",
  //         "location": "Brisbane River"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2025-07-01",
  //     "summary": "Day trip to Moreton Island",
  //     "activities": [
  //       {
  //         "time": "08:00",
  //         "title": "Ferry to Moreton Island",
  //         "description": "Take a ferry ride to the stunning Moreton Island.",
  //         "location": "Brisbane Ferry Terminal"
  //       },
  //       {
  //         "time": "10:00",
  //         "title": "Sandboarding on the Tangalooma Island Resort",
  //         "description": "Experience the thrill of sandboarding on the island's dunes.",
  //         "location": "Tangalooma Island Resort"
  //       },
  //       {
  //         "time": "12:30",
  //         "title": "Lunch at Tangalooma Resort",
  //         "description": "Enjoy a beachfront lunch with local seafood options.",
  //         "location": "Tangalooma Island Resort"
  //       },
  //       {
  //         "time": "15:00",
  //         "title": "Snorkeling Tour",
  //         "description": "Explore the shipwrecks and marine life around Moreton Island.",
  //         "location": "Tangalooma Island Resort"
  //       }
  //     ]
  //   },
  //   {
  //     "date": "2025-07-02",
  //     "summary": "Last day in Brisbane and departure",
  //     "activities": [
  //       {
  //         "time": "09:00",
  //         "title": "Visit Lone Pine Koala Sanctuary",
  //         "description": "Get up close with koalas and kangaroos at Australia's oldest koala sanctuary.",
  //         "location": "Lone Pine, Brisbane"
  //       },
  //       {
  //         "time": "12:00",
  //         "title": "Lunch at The Breakfast Creek Hotel",
  //         "description": "Enjoy a classic Australian pub lunch at this historic venue.",
  //         "location": "Breakfast Creek, Brisbane"
  //       },
  //       {
  //         "time": "14:00",
  //         "title": "Shopping at Queen Street Mall",
  //         "description": "Explore the vibrant shopping precinct before departure.",
  //         "location": "Queen Street Mall, Brisbane"
  //       },
  //       {
  //         "time": "16:00",
  //         "title": "Check-out and Head to Airport",
  //         "description": "Prepare for your flight back home.",
  //         "location": "Brisbane Airport"
  //       }
  //     ]
  //   }
  // ];
    setItinerary(data?.dailyPlan);
    // setItinerary(dummdata)
    setLoading(false);
    console.log(data);
  }, [data]);

  //use effect function to set on flight data updated
  useEffect(()=>{
    setTempFlight(flightData)
    console.log("tguis",flightData)
  },[flightData])



  return (
    <div className="p-6 max-w-[70%] mx-auto">
      { !itinerary && !loadingG ? 
        
        <div className="text-center mt-10">
            {/* <img src="/empty-state.svg" className="w-1/2 mx-auto mb-4" alt="Search Prompt" /> */}
            <h3 className="text-3xl font-semibold">Select Destination and Date to get Started</h3>
            <p className="text-lg mb-4">Or explore our popular trip ideas below</p>
            <FeaturedCards/>
        </div>
        :
        <>
           {
        loadingG || !itinerary ? <h2 className="text-2xl font-bold mb-4">Generating Your Trip Plan</h2>
          :
        <h2 className="text-2xl font-bold mb-4">Your Complete Trip Plan</h2>
      }
      
      <div className="flex flex-col md:flex-row md:gap-10">
        
          {/* displaying trip only if itenary has been loaded */}
          <div className="flex-2/3">

          
          {loadingG || !itinerary
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
                <div key={idx} className="relative pb-10 last:pb-0 ">
                 

                  {/* Day header */}
                  <div
                    onClick={() => toggleDay(idx)}
                    className="cursor-pointer select-none"
                  >
                    <h3 className="text-lg font-bold text-gray-800 flex items-center justify-between pr-4">
                      {day.summary}
                      {/* {openIndex === idx ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )} */}
                      <motion.div
                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </h3>
                    <p className="text-sm text-gray-500">Day {idx + 1} – {day.date}</p>
                  </div>

                  <AnimatePresence initial={false}>
                    {openIndex === idx && (
                      <motion.div
                        className="mt-4 relative pl-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        layout
                      >
                        {/* Line for this day's activities */}
                        <div className="absolute top-2 bottom-2 w-px border-l-2 border-dotted border-primary" />

                        {day.activities.map((act, i) => (
                          <div key={i} className="relative mb-6">
                            {/* Dot for each activity */}
                            <div className="absolute left-[-5px] top-2 w-3 h-3 bg-primary border-2 border-white rounded-full z-10" />

                            {/* Activity Card */}
                            <div className="ml-6 bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                                <span>{act.time}</span>
                                <span>{act.location}</span>
                              </div>
                              <h4 className="text-md font-semibold text-gray-800">{act.title}</h4>
                              <p className="text-sm text-gray-600">{act.description}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              </div>

              <div className="flex flex-1/3 flex-col">
              {/* dusplaying flight */}
                <FlightCard flightData={tempFlight}/> 

                <EventSwiper events={events} /> 

                {/* displaying hotels */}
                <HotelList hotels={hotel}/>

                

              </div>
        </div>
        </>

      }
        
    </div>
  );
}