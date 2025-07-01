'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState } from 'react'


export  const DailyActivitiesContext = createContext();

export default function page() {
      const [dailyActivities,setDailyActivities] = useState();

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities}}>
              <LocationPicker/>
              <ItineraryList data={dailyActivities}/>
    
              
            </DailyActivitiesContext.Provider>
          </div>
  )
}
