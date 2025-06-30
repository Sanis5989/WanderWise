"use client"

import React from 'react'
import Navbar from './Navbar'
import LocationPicker from './LocationPicker'
import ItineraryList from './Itinerary'
import { createContext, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import HeroSection from './HeroSection'

export  const DailyActivitiesContext = createContext();

export default function HomePage() {
  const [dailyActivities,setDailyActivities] = useState();



  return (
    
    <div>
  
      {/* Navbar */}
      <Navbar/>
      <div>
        <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities}}>
          <LocationPicker/>
          <ItineraryList data={dailyActivities}/>

          <HeroSection/>
        </DailyActivitiesContext.Provider>
      </div>
    </div>
  )
}
