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
      const [landing, setLanding] = useState(false)

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities,flight,setFlight, loadingG, setLoadingG}}>
              
                

                <LocationPicker/>
                {landing || loadingG ? <ItineraryList data={dailyActivities} flightData={flight}/> : <>Hello ther</>  }
                {/* <ItineraryList data={dailyActivities} flightData={flight}/> */}
              
            </DailyActivitiesContext.Provider>
          </div>
  )
}
