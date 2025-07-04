'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState } from 'react'
import UseCases from '../Components/UseCases';
import FeaturedCards from '../Components/FeaturedCards';


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

                {/* displaying itenary or search infos */}
                {landing || loadingG ? 
                  <ItineraryList data={dailyActivities} flightData={flight}/> 
                  :
                  <div>
                    <div className="text-center mt-10">
                      {/* <img src="/empty-state.svg" className="w-1/2 mx-auto mb-4" alt="Search Prompt" /> */}
                      <h3 className="text-3xl font-semibold">Select Destination and Date to get Started</h3>
                      <p className="text-lg mb-4">Or explore our popular trip ideas below</p>
                      <FeaturedCards/>
                    </div>
                  </div>  
                }
              
            </DailyActivitiesContext.Provider>
          </div>
  )
}
