'use client';
import { addDays, format } from 'date-fns';
import Image from 'next/image';
import { useContext , useEffect} from 'react';
import { DailyActivitiesContext, TripContext } from "../contexts/TripContext";
import { useSearchParams } from 'next/navigation';
import { locationAirport,locationHotels, locations } from '../Utils/location';
import toast from 'react-hot-toast';

export const featuredDeals = [
  {
    image: '/sydney.jpg',
    tag: 'Weekend Escape',
    title: '2-Day Escape to Sydney – Opera House & Bondi Walk',
    description: 'Perfect for a weekend getaway with beach time, cultural spots, and iconic attractions.',
    price: 'From $299 AUD',
    plannerParams: {
      destination: 'Sydney',
      duration: 2,
      themes: ['culture', 'coastal', 'food'],
      ageGroup: 'all',
    },
  },
  {
    image: '/barossa-wine.jpg',
    tag: 'Food & Wine',
    title: 'Barossa Valley Wine & Dine Tour – Taste the Best of SA',
    description: 'Experience South Australia’s best wine region with guided tastings and gourmet food.',
    price: 'From $199 AUD',
    plannerParams: {
      destination: 'Adelaide',
      duration: 3,
      themes: ['food', 'wine', 'leisure'],
      ageGroup: 'adults',
    },
  },
  {
    image: '/rainforest-cairns.jpg',
    tag: 'Nature Adventure',
    title: 'Cairns Rainforest Adventure – Skyrail & Kuranda',
    description: 'Ride above the rainforest and visit the artisan village of Kuranda with wildlife experiences.',
    price: 'From $350 AUD',
    plannerParams: {
      destination: 'Cairns',
      duration: 4,
      themes: ['nature', 'wildlife', 'culture'],
      ageGroup: 'family',
    },
  },
  {
    image: '/melbourne-culture.jpg',
    tag: 'City Discovery',
    title: 'Melbourne Art & Café Culture – Street Tours & Laneways',
    description: 'Discover the artistic heartbeat of Melbourne through local-led laneway and gallery tours.',
    price: 'From $259 AUD',
    plannerParams: {
      destination: 'Melbourne',
      duration: 3,
      themes: ['art', 'urban', 'food'],
      ageGroup: 'young adults',
    },
  },
];



export default function FeaturedCards() {

  const searchParams = useSearchParams();

  useEffect(()=>{
      const source = searchParams.get('source');
      const destination = searchParams.get('destination');
      const curLocation = searchParams.get('curLocation');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
        if (source === 'home'){
          console.log("from home")
          if(destination && curLocation && startDate && endDate){
                search("Brisbane",destination,new Date(startDate),new Date(endDate))
          }
          else{
            toast.error("Error Fetching");
          }
          
        }
      },[])


  
  const {destination, setDestination,curLocation, setCurLocation,startDate, setStartDate,endDate, setEndDate} = useContext(TripContext);
  const{setLoadingG, setEvents, setHotel,setFlight,setDailyActivities} =useContext(DailyActivitiesContext)
   
  
  //function to create detailed itenary
  const search = async (from, to, startDate, endDate) => {
  console.log(from, to, startDate, endDate);

    setCurLocation(from);
    setDestination(to);
    setStartDate(startDate);
    setEndDate(endDate)
  localStorage.setItem("destination", to)
  if (!from || !to) {
    console.log("input data");
    toast.error("Please select a destination.");
    return;
  }
  setLoadingG(true)

  // Validate date range (at least 1 day apart)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInMs = end - start;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 1) {
    toast.error("Please select an end date at least 1 day after the start date.");
    return;
  }


  const hotelUrl = `https://booking-com18.p.rapidapi.com/stays/search?locationId=${locationHotels[to]}&checkinDate=${startDate.toISOString().split("T")[0]}&checkoutDate=${endDate.toISOString().split("T")[0]}&units=metric&temperature=c`;
  const hotelOptions = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_HOTEL_API ,
      'x-rapidapi-host': 'booking-com18.p.rapidapi.com'
    }
  };

  const flightUrl = `https://flights-sky.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${locationAirport[from]}&toEntityId=${locationAirport[to]}&departDate=${startDate.toISOString().split("T")[0]}&returnDate=${endDate.toISOString().split("T")[0]}`;
  const flightOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_FLIGHT_API,
      "x-rapidapi-host": "flights-sky.p.rapidapi.com",
    },
  };

  

 try {

  const eventsRawData =
  {
    city: to,
    startDate:startDate,
    endDate:endDate
  }
  
  const eventsOptions = {
    method:"POST",
    headers:{"Content-type" : "application/json"},
    body: JSON.stringify({eventsRawData})
  }
  // Start all requests
  const hotelRequest = fetch(hotelUrl, hotelOptions);
  const flightRequest = fetch(flightUrl, flightOptions);
  const eventsApiRequest = fetch("/api/events",eventsOptions)


  // Wait for both to complete
  const [hotelResponse, flightResponse, eventsResponse] = await Promise.all([hotelRequest, flightRequest, eventsApiRequest]);

  // Parse JSON responses
  const hotelData = await hotelResponse.json();
  const flightData = await flightResponse.json();
  const eventsData = await eventsResponse.json();

  console.log(eventsData)
  setEvents(eventsData)

  // --- Hotel ---
  const cleanResult = (hotelData) => {
    return hotelData?.data?.slice(0, 5).map((hotel) => ({
      name: hotel.name,
      image: hotel.photoUrls?.[0]?.replace("square60", "400x250"),
      price: hotel.priceBreakdown?.grossPrice?.amountRounded || "Price not available",
      location: hotel.wishlistName || "Location not available",
      stayDate: [
        format(startDate, "dd MMM yyyy"),
        format(endDate, "dd MMM yyyy")
      ],
      url: `https://www.booking.com/hotel/${hotel.id}.html`
    }));
  };

    const formattedHotels = cleanResult(hotelData);
    setHotel(formattedHotels);

    // --- Flight ---
    const flight = flightData?.data?.itineraries?.[0];
    const fli = flightData?.data?.itineraries?.[0]?.legs;

    console.log("Flight Legs:", fli);
    setFlight(flight);

    if (!flight) {
      toast.error("No flights found.");
      return;
    }

    // Build input including flight
    const input = {
      from,
      to,
      startDate,
      endDate,
      flight:{...fli},
      hotel:formattedHotels[0]
    };

    //OpenAI call with updated input
    const openAIRes = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const openAIData = await openAIRes.json();
    console.log("OpenAI Response:", openAIData);

    const plan = {
                    "title": `Trip to ${to}`,
                    "destination": to,
                    "dailyPlan": openAIData?.dailyPlan
                  }

    const saveTrip = await fetch("/api/plans",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan) ,
      })

    if(saveTrip.ok){
      console.log("trip saved")
    }
    setDailyActivities(openAIData);

  } catch (error) {
    console.error("Error fetching hotels, flights or openai:", error);
    toast.error("Something went wrong while fetching data.");
  }
  finally{
    setLoadingG(false)
  }

  }

  //loading default today date 
    const today = addDays(new Date(), 1)
    const searchD = async (from, to, startDate, endDate) =>{
      setCurLocation(from);
      setDestination(to);
      setStartDate(startDate);
      setEndDate(endDate)
      console.log(from,to, startDate, endDate)
    }



  return (
    <div className=" pb-12 px-4 md:px-12 ">
      <h2 className="text-3xl font-bold text-center mb-8">Exciting Featured Adventure Deals for Your Next Trip</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {featuredDeals.map((deal, index) => (
          <div key={index} 
            className="bg-card w-[300px] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer dark:hover:shadow-gray-700"
            onClick={()=>search("Brisbane",deal?.plannerParams?.destination,today,addDays(today, deal?.plannerParams?.duration))}
            >
            <div className="relative w-full h-52">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-3 left-3 bg-yellow-400 text-xs text-black font-semibold px-3 py-1 rounded-md shadow">
                {deal.tag}
              </span>
            </div>
            <div className="p-4 text-card-foreground">
              <h3 className="font-semibold text-sm mb-2">{deal.title}</h3>
              <p className="text-sm -700 mb-3">{deal.description}</p>
              {/* <p className="font-bold text-yellow-600 text-sm">{deal.price}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
