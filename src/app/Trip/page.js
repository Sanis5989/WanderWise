'use client'
import React from 'react'
import LocationPicker from '../Components/LocationPicker';
import ItineraryList from '../Components/Itinerary'
import { createContext, useState ,useEffect} from 'react'
import UseCases from '../Components/UseCases';
import FeaturedCards from '../Components/FeaturedCards';
import { useSearchParams } from 'next/navigation';
import { addDays } from 'date-fns';


export  const DailyActivitiesContext = createContext();
export const TripContext = createContext();


export default function Page() {
    const searchParams = useSearchParams();

    useEffect(() => {
      const source = searchParams.get('source');
      const destination = searchParams.get('destination');
      const curLocation = searchParams.get('curLocation');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
  
      if (source === 'home') {
        // Run function if came from home
        console.log('Running function from homepage', destination);
        setDestination(destination);
        setCurLocation(curLocation);
        setStartDate(startDate);
        setEndDate(endDate);
      }
    }, [searchParams]);

    const [dailyActivities,setDailyActivities] = useState();
    const [flight, setFlight] = useState();
    const [loadingG, setLoadingG] =useState(false);
    const [landing, setLanding] = useState(false)
    const [hotel,setHotel] =useState();
    const [events, setEvents] =useState([]);
    const [destination, setDestination] = useState("");
    const [curLocation, setCurLocation ] =useState("");
    const [startDate, setStartDate] = useState(addDays(new Date() , 1));
    const [endDate, setEndDate] = useState(addDays(new Date() , 2));

    

  return (
    <div>
            <DailyActivitiesContext.Provider value={{dailyActivities, setDailyActivities,flight,setFlight, loadingG, setLoadingG, hotel, setHotel, events, setEvents}}>
              <TripContext.Provider value={{destination, setDestination,curLocation, setCurLocation,startDate, setStartDate,endDate, setEndDate}}>
                <LocationPicker/>
                {/* displaying itenary or search infos */}
                <ItineraryList data={dailyActivities} flightData={flight} hotel={hotel} events={events}/> 
              </TripContext.Provider>
            </DailyActivitiesContext.Provider>
          </div>
  )
}
