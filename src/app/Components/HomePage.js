"use client"

import React from 'react'
import Navbar from './Navbar'
import LocationPicker from './LocationPicker'
import ItineraryList from './Itinerary'
import { createContext, useState } from 'react'

import HeroSection from './HeroSection'

// export  const DailyActivitiesContext = createContext();

export default function HomePage() {
  const [dailyActivities,setDailyActivities] = useState();



  return (
    <div>
      {/* Navbar */}
      <Navbar/>
      
      <HeroSection/>
    </div>
  )
}
