"use client"
import React, { useState } from "react";
import { FaMapMarkerAlt, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function LocationPicker() {
const locations = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Gold Coast",
  "Perth",
  "Adelaide",
  "Canberra",
  "Darwin",
  "Hobart",
];

  const [from, setFrom] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [to, setTo] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

//   function to swap destination and start location
  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };
  
  //function to handle current location
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFrom(coords); // Later: Convert coords to city using reverse geocoding
        console.log(coords)
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-6">
      <div className="flex items-center justify-between rounded-full shadow-md px-4 py-6 gap-2 flex-wrap">
        {/* Leaving From */}
        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
          <FaMapMarkerAlt className="text-gray-500" size={25}/>
          <div className="w-full">
            <select
                className="w-full border border-gray-300 rounded-xl p-2"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
            >
                <option value="">Current location</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>
                        {loc}
                        </option>
                    ))}
          </select>

        </div>
        <button
            onClick={handleGeolocation}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer"
          >
            <TbCurrentLocation size={20} />
          </button>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <FaExchangeAlt size={18}/>
        </button>

        {/* Going To Destination */}
        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
          <FaMapMarkerAlt className="text-gray-500" size={25}/>
          <div className="w-full">
          
          <select
            className="w-full border border-gray-300 rounded-xl p-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            <option value="">Destination</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        
        </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px] justify-center">
          <FaCalendarAlt className="text-gray-500 me-1.5" size={25}/>
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates ;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            className="bg-transparent outline-none w-full cursor-pointer"
            placeholderText="Select dates"
          />
        </div>

        {/* Search Button */}
        <button className="button-primary">
          Search
        </button>
      </div>
      
    </div>
  );
}
