'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState } from 'react'
import UseCases from '../Components/UseCases';
import FeaturedCards from '../Components/FeaturedCards';


export  const DailyActivitiesContext = createContext();


export default function Page() {
      const [dailyActivities,setDailyActivities] = useState();
      const [flight, setFlight] = useState();
      const [loadingG, setLoadingG] =useState(false);
      const [landing, setLanding] = useState(false)
      const [hotel,setHotel] =useState();
      const [events, setEvents] =useState([]);

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities,flight,setFlight, loadingG, setLoadingG, hotel, setHotel, events, setEvents}}>

                <LocationPicker/>

{/* <ItineraryList data={dailyActivities} flightData={flight} hotel={hotel} events={events}/>  */}

                {/* displaying itenary or search infos */}
                  <ItineraryList data={dailyActivities} flightData={flight} hotel={hotel} events={events}/> 
                  
              
            </DailyActivitiesContext.Provider>
          </div>
  )
}
