"use client"
import Image from "next/image";
import { useContext, useEffect } from "react";
import { DailyActivitiesContext } from "../contexts/TripContext";
// import { FlightContext } from "../Trip/page";

export default function FlightCard({flightData}) {
  

  const formatTime = (datetime) =>
    new Date(datetime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (datetime) =>
    new Date(datetime).toLocaleDateString();

  const {loadingG} = useContext(DailyActivitiesContext)


  // const { price, legs } = flightData;

  const price = flightData?.price;
  const legs = flightData?.legs

  useEffect(()=>{
    console.log(flightData)
  },[flightData])

  return (
    flightData && !loadingG ? 
    <div className="border border-gray-200 rounded-lg shadow-sm p-4  bg-background max-w-3xl mx-auto space-y-4 mb-auto">
      <h2 className="text-xl font-semibold text-gray-800">Round Trip Flight</h2>

      {legs.map((leg, index) => (
        <div
          key={leg.id}
          className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b pb-4"
        >
          <div className="flex items-center gap-3">
            <Image
              src={leg.carriers.marketing[0].logoUrl}
              alt={leg.carriers.marketing[0].name}
              width={32}
              height={32}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              {leg.carriers.marketing[0].name}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium">
              {leg.origin.city} ({leg.origin.displayCode}) →
              {leg.destination.city} ({leg.destination.displayCode})
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(leg.departure)} ·{" "}
              {formatTime(leg.departure)} → {formatTime(leg.arrival)} ·{" "}
              {Math.floor(leg.durationInMinutes / 60)}h{" "}
              {leg.durationInMinutes % 60}m
            </p>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <span className="text-lg font-bold text-gray-800">
          {price.formatted}
        </span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ">
          Book Now
        </button>
      </div>
    </div> : <></>
    
  );
}
