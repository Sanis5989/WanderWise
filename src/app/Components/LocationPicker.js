"use client"
import React, { useContext, useState } from "react";
import { FaMapMarkerAlt, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DailyActivitiesContext } from "../Trip/page";
import toast, { Toaster } from 'react-hot-toast';


export default function LocationPicker() {

  //context for daily activities
   const { setDailyActivities } = useContext(DailyActivitiesContext);

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

  //function to swap destination and start location
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

  // Add loading state
  // setLoading(true); // Make sure you have this state

  const options = {
    enableHighAccuracy: true,    // Request high accuracy
    timeout: 10000,              // 10 second timeout
    maximumAge: 60000           // Accept cached position up to 1 minute old
  };

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const coords = `${latitude}, ${longitude}`;
      
      console.log(`Position accuracy: ${accuracy} meters`);
      
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'YourAppName/1.0' // Add user agent for better API compliance
            }
          }
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Reverse geocoding response:', position);
        
        // Better address parsing
        const address = data.address || {};
        const city = address.city || 
                    address.town || 
                    address.village || 
                    address.suburb ||
                    address.neighbourhood ||
                    address.hamlet ||
                    "Unknown location";
        
        setFrom(city);
        console.log(`Current city: ${city}`, data);
        
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setFrom(coords); // fallback to coordinates
      } finally {
        // setLoading(false);
      }
    },
    (error) => {
      // setLoading(false);
      console.error("Geolocation error:", error);
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("Location access denied by user");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information unavailable");
          break;
        case error.TIMEOUT:
          alert("Location request timed out");
          break;
        default:
          alert("An unknown error occurred while retrieving location");
          break;
      }
    },
    options // Pass the options object
  );
};


  //function to create detailed itenary
  const search = async ()=>{
    console.log(from,to,startDate,endDate)
    if(from != "" && to != "" ){
      const input = {from,to,startDate,endDate}
        const res = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input })
        });
        console.log("open")
        const data = await res.json();
        console.log("OpenAI Response:", data);
        setDailyActivities(data)
    }
    else{
      console.log("inpit data");
      toast.error("Please select a destination.")
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-6">
      <div className="flex items-center justify-between rounded-full shadow-md px-4 py-6 gap-2 flex-wrap">
        {/* Leaving From */}
        <div className="flex items-center gap-2 flex-1 min-w-[150px] md:ml-5">
          <FaMapMarkerAlt className="text-gray-500 " size={25}/>
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
        {/* <button
          onClick={handleSwap}
          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
        >
          <FaExchangeAlt size={18}/>
        </button> */}

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
        <button className="button-primary font-semibold mr-4" onClick={()=> search()}>
          Search
        </button>
      </div>
      
    </div>
  );
}
