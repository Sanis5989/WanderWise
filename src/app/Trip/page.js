'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState } from 'react'


export  const DailyActivitiesContext = createContext();


export default function page() {
      const [dailyActivities,setDailyActivities] = useState();
      const [flight, setFlight] = useState();
      const [loadingG, setLoadingG] =useState(false);

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities,flight,setFlight, loadingG, setLoadingG}}>
              {/* <FlightContext.Provider value={{flight,setFlight}}> */}
                <LocationPicker/>
                <ItineraryList data={dailyActivities} flightData={flight}/>
              {/* </FlightContext.Provider> */}
            </DailyActivitiesContext.Provider>
          </div>
  )
}
