'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState } from 'react'


export  const DailyActivitiesContext = createContext();
export const FlightContext = createContext();

export default function page() {
      const [dailyActivities,setDailyActivities] = useState();
      const [flight, setFlight] = useState();

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities}}>
              <FlightContext.Provider value={{flight,setFlight}}>
                <LocationPicker/>
                <ItineraryList data={dailyActivities} flight={flight}/>
              </FlightContext.Provider>
            </DailyActivitiesContext.Provider>
          </div>
  )
}
