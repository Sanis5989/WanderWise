"use client"
import React, { useContext, useEffect, useState, useMemo , useRef} from "react";
import { FaMapMarkerAlt, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DailyActivitiesContext} from "../Trip/page";
import toast, { Toaster } from 'react-hot-toast';
import { addDays,format } from "date-fns";
import { TripContext } from '../Trip/page';
import { locationAirport,locationHotels,locations } from "../Utils/location";
import Fuse from "fuse.js";

const options = {
  includeScore: true,
  threshold: 0.4,
};


export default function LocationPicker() {

  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const destinationRef = useRef(null);

  const [queryDestination, setQueryDestination] = useState('');
  const [showDropdownDestination, setShowDropdownDestination] = useState(false);

   // Create fuse instance once with locations data
  const fuse = useMemo(() => new Fuse(locations, options), []);

  // Perform fuzzy search only if query exists
  const results = query ? fuse.search(query).map(result => result.item): locations;

  //context for daily activities
  const { setDailyActivities ,setFlight ,flight, setLoadingG, setHotel , setEvents, hotel} = useContext(DailyActivitiesContext);

  const destinationFuse = useMemo(() => new Fuse(locations, options), []);
  const filteredResults = queryDestination
    ? destinationFuse.search(queryDestination).map((result) => result.item)
    : locations;

  // Hide current location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDropdownDestination(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);




  const {destination, setDestination,curLocation, setCurLocation,startDate, setStartDate,endDate, setEndDate} = useContext(TripContext)

  // useEffect(()=>{
  //   handleGeolocation()
  // })

  //function to handle current location
  const handleGeolocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser");
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  };

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      console.log(`Position accuracy: ${accuracy} meters`);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'WanderWiseApp/1.0' // Update this to your app name
            }
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const address = data.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          address.neighbourhood ||
          address.hamlet ||
          "Unknown location";

        console.log("Detected city:", city);

       // Lower threshold = stricter match
        const result = fuse.search(city); // city = "Gold Coast City"
        if (result.length > 0) {
          setCurLocation(result[0].item); // sets "Gold Coast"
        } else {
          console.log("falback city")
          setCurLocation(city); // fallback
        }

      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setCurLocation(`${latitude}, ${longitude}`); // Fallback to coords
      }
    },
      (error) => {
        // setLoading(false);
        console.error("Geolocation error:", error);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable");
            break;
          case error.TIMEOUT:
            alert("Location request timed out");
            break;
          default:
            alert("An unknown error occurred while retrieving location");
            break;
        }
      },
      options // Pass the options object
    );
  };
  
  // const dummyFlightsResponse = {
  //   "data": {
  //     "context": {
  //       "status": "incomplete",
  //       "sessionId": "KLUv_SCN3QMA0sgdHsDr1_zv_v-LbYAkIgXttnmpMkkiSeQi1YGgYtH3Cs4TIM9864UpdA3ud8d9XnmlZHxru8nTt0RRlVIAhssuC7sIFxn3kCGdll-fzfdj5O04fec_f7XV5AiIFx3l_zZ7Muuvyp2Sedm7LoXtUlaaDM0AFYAQDQEA",
  //       "totalResults": 10
  //     },
  //     "itineraries": [
  //       {
  //         "id": "16692-2507042135--31940-0-10041-2507042305|10041-2507071635--31694-0-16692-2507071810",
  //         "price": {
  //           "raw": 271.86,
  //           "formatted": "$272",
  //           "pricingOptionId": "LAy0Nda4pBNs"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507042135--31940-0-10041-2507042305",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T21:35:00",
  //             "arrival": "2025-07-04T23:05:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507042135-2507042305--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T21:35:00",
  //                 "arrival": "2025-07-04T23:05:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "556",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071635--31694-0-16692-2507071810",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T16:35:00",
  //             "arrival": "2025-07-07T18:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31694,
  //                   "alternateId": "V1",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //                   "name": "Virgin Australia",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071635-2507071810--31694",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T16:35:00",
  //                 "arrival": "2025-07-07T18:10:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "966",
  //                 "marketingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "tags": [
  //           "cheapest",
  //           "second_shortest"
  //         ],
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.999
  //       },
  //       {
  //         "id": "16692-2507042030--31694-0-10041-2507042200|10041-2507071635--31694-0-16692-2507071810",
  //         "price": {
  //           "raw": 318.96,
  //           "formatted": "$319",
  //           "pricingOptionId": "Yf_INPKiimmd"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507042030--31694-0-10041-2507042200",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T20:30:00",
  //             "arrival": "2025-07-04T22:00:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31694,
  //                   "alternateId": "V1",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //                   "name": "Virgin Australia",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507042030-2507042200--31694",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T20:30:00",
  //                 "arrival": "2025-07-04T22:00:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "993",
  //                 "marketingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071635--31694-0-16692-2507071810",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T16:35:00",
  //             "arrival": "2025-07-07T18:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31694,
  //                   "alternateId": "V1",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //                   "name": "Virgin Australia",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071635-2507071810--31694",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T16:35:00",
  //                 "arrival": "2025-07-07T18:10:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "966",
  //                 "marketingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "tags": [
  //           "third_cheapest",
  //           "third_shortest"
  //         ],
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.877965
  //       },
  //       {
  //         "id": "16692-2507042135--31940-0-10041-2507042305|10041-2507072045--32166-0-16692-2507072215",
  //         "price": {
  //           "raw": 273.22,
  //           "formatted": "$274",
  //           "pricingOptionId": "Fj-1TOWnznD1"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507042135--31940-0-10041-2507042305",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T21:35:00",
  //             "arrival": "2025-07-04T23:05:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507042135-2507042305--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T21:35:00",
  //                 "arrival": "2025-07-04T23:05:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "556",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507072045--32166-0-16692-2507072215",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T20:45:00",
  //             "arrival": "2025-07-07T22:15:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507072045-2507072215--32166",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T20:45:00",
  //                 "arrival": "2025-07-07T22:15:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "825",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "tags": [
  //           "second_cheapest",
  //           "shortest"
  //         ],
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.787516
  //       },
  //       {
  //         "id": "16692-2507041525--32166-0-10041-2507041655|10041-2507071155--32166-0-16692-2507071330",
  //         "price": {
  //           "raw": 411.87,
  //           "formatted": "$412",
  //           "pricingOptionId": "5jVgdE4yiI1r"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041525--32166-0-10041-2507041655",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T15:25:00",
  //             "arrival": "2025-07-04T16:55:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041525-2507041655--32166",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T15:25:00",
  //                 "arrival": "2025-07-04T16:55:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "828",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071155--32166-0-16692-2507071330",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T11:55:00",
  //             "arrival": "2025-07-07T13:30:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071155-2507071330--32166",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T11:55:00",
  //                 "arrival": "2025-07-07T13:30:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "817",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.74585
  //       },
  //       {
  //         "id": "16692-2507041525--32166-0-10041-2507041655|10041-2507071515--32166-0-16692-2507071650",
  //         "price": {
  //           "raw": 422.74,
  //           "formatted": "$423",
  //           "pricingOptionId": "pGQvwG4CQgK_"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041525--32166-0-10041-2507041655",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T15:25:00",
  //             "arrival": "2025-07-04T16:55:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041525-2507041655--32166",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T15:25:00",
  //                 "arrival": "2025-07-04T16:55:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "828",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071515--32166-0-16692-2507071650",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T15:15:00",
  //             "arrival": "2025-07-07T16:50:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071515-2507071650--32166",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T15:15:00",
  //                 "arrival": "2025-07-07T16:50:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "821",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.740328
  //       },
  //       {
  //         "id": "16692-2507041140--31940-0-10041-2507041310|10041-2507071635--31694-0-16692-2507071810",
  //         "price": {
  //           "raw": 441.77,
  //           "formatted": "$442",
  //           "pricingOptionId": "jeFOqAtx3PeL"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041140--31940-0-10041-2507041310",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T11:40:00",
  //             "arrival": "2025-07-04T13:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041140-2507041310--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T11:40:00",
  //                 "arrival": "2025-07-04T13:10:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "516",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071635--31694-0-16692-2507071810",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T16:35:00",
  //             "arrival": "2025-07-07T18:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31694,
  //                   "alternateId": "V1",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //                   "name": "Virgin Australia",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071635-2507071810--31694",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T16:35:00",
  //                 "arrival": "2025-07-07T18:10:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "966",
  //                 "marketingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.708461
  //       },
  //       {
  //         "id": "16692-2507041005--31940-0-10041-2507041135|10041-2507071635--31694-0-16692-2507071810",
  //         "price": {
  //           "raw": 441.77,
  //           "formatted": "$442",
  //           "pricingOptionId": "nQWj-21BEE8S"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041005--31940-0-10041-2507041135",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T10:05:00",
  //             "arrival": "2025-07-04T11:35:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041005-2507041135--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T10:05:00",
  //                 "arrival": "2025-07-04T11:35:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "512",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071635--31694-0-16692-2507071810",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T16:35:00",
  //             "arrival": "2025-07-07T18:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31694,
  //                   "alternateId": "V1",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //                   "name": "Virgin Australia",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071635-2507071810--31694",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T16:35:00",
  //                 "arrival": "2025-07-07T18:10:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "966",
  //                 "marketingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31694,
  //                   "name": "Virgin Australia",
  //                   "alternateId": "V1",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.703344
  //       },
  //       {
  //         "id": "16692-2507041525--32166-0-10041-2507041655|10041-2507070950--32166-0-16692-2507071125",
  //         "price": {
  //           "raw": 432.25,
  //           "formatted": "$433",
  //           "pricingOptionId": "a9dvksaMOM-z"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041525--32166-0-10041-2507041655",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T15:25:00",
  //             "arrival": "2025-07-04T16:55:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041525-2507041655--32166",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T15:25:00",
  //                 "arrival": "2025-07-04T16:55:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "828",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507070950--32166-0-16692-2507071125",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T09:50:00",
  //             "arrival": "2025-07-07T11:25:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507070950-2507071125--32166",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T09:50:00",
  //                 "arrival": "2025-07-07T11:25:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "815",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.703267
  //       },
  //       {
  //         "id": "16692-2507040705--31940-0-10041-2507040835|10041-2507072045--31940-0-16692-2507072220",
  //         "price": {
  //           "raw": 455.79,
  //           "formatted": "$456",
  //           "pricingOptionId": "cCVc_1S2qmV8"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507040705--31940-0-10041-2507040835",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T07:05:00",
  //             "arrival": "2025-07-04T08:35:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507040705-2507040835--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T07:05:00",
  //                 "arrival": "2025-07-04T08:35:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "504",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507072045--31940-0-16692-2507072220",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T20:45:00",
  //             "arrival": "2025-07-07T22:20:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507072045-2507072220--31940",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T20:45:00",
  //                 "arrival": "2025-07-07T22:20:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "559",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.70319
  //       },
  //       {
  //         "id": "16692-2507041140--31940-0-10041-2507041310|10041-2507071310--32166-0-16692-2507071445",
  //         "price": {
  //           "raw": 459.44,
  //           "formatted": "$460",
  //           "pricingOptionId": "lfEDTiMS52M0"
  //         },
  //         "legs": [
  //           {
  //             "id": "16692-2507041140--31940-0-10041-2507041310",
  //             "origin": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 90,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-04T11:40:00",
  //             "arrival": "2025-07-04T13:10:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -31940,
  //                   "alternateId": "QF",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //                   "name": "Qantas",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "16692-10041-2507041140-2507041310--31940",
  //                 "origin": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-04T11:40:00",
  //                 "arrival": "2025-07-04T13:10:00",
  //                 "durationInMinutes": 90,
  //                 "flightNumber": "516",
  //                 "marketingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -31940,
  //                   "name": "Qantas",
  //                   "alternateId": "QF",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           },
  //           {
  //             "id": "10041-2507071310--32166-0-16692-2507071445",
  //             "origin": {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane",
  //               "displayCode": "BNE",
  //               "city": "Brisbane",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "destination": {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney",
  //               "displayCode": "SYD",
  //               "city": "Sydney",
  //               "country": "Australia",
  //               "isHighlighted": false
  //             },
  //             "durationInMinutes": 95,
  //             "stopCount": 0,
  //             "isSmallestStops": false,
  //             "departure": "2025-07-07T13:10:00",
  //             "arrival": "2025-07-07T14:45:00",
  //             "timeDeltaInDays": 0,
  //             "carriers": {
  //               "marketing": [
  //                 {
  //                   "id": -32166,
  //                   "alternateId": "JQ",
  //                   "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //                   "name": "Jetstar",
  //                   "allianceId": 0
  //                 }
  //               ],
  //               "operationType": "fully_operated"
  //             },
  //             "segments": [
  //               {
  //                 "id": "10041-16692-2507071310-2507071445--32166",
  //                 "origin": {
  //                   "flightPlaceId": "BNE",
  //                   "displayCode": "BNE",
  //                   "parent": {
  //                     "flightPlaceId": "BNEA",
  //                     "displayCode": "BNE",
  //                     "name": "Brisbane",
  //                     "type": "City"
  //                   },
  //                   "name": "Brisbane",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "destination": {
  //                   "flightPlaceId": "SYD",
  //                   "displayCode": "SYD",
  //                   "parent": {
  //                     "flightPlaceId": "SYDA",
  //                     "displayCode": "SYD",
  //                     "name": "Sydney",
  //                     "type": "City"
  //                   },
  //                   "name": "Sydney",
  //                   "type": "Airport",
  //                   "country": "Australia"
  //                 },
  //                 "departure": "2025-07-07T13:10:00",
  //                 "arrival": "2025-07-07T14:45:00",
  //                 "durationInMinutes": 95,
  //                 "flightNumber": "829",
  //                 "marketingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 },
  //                 "operatingCarrier": {
  //                   "id": -32166,
  //                   "name": "Jetstar",
  //                   "alternateId": "JQ",
  //                   "allianceId": 0,
  //                   "displayCode": ""
  //                 }
  //               }
  //             ]
  //           }
  //         ],
  //         "isSelfTransfer": false,
  //         "isProtectedSelfTransfer": false,
  //         "farePolicy": {
  //           "isChangeAllowed": false,
  //           "isPartiallyChangeable": false,
  //           "isCancellationAllowed": false,
  //           "isPartiallyRefundable": false
  //         },
  //         "fareAttributes": {},
  //         "isMashUp": false,
  //         "hasFlexibleOptions": false,
  //         "score": 0.700737
  //       }
  //     ],
  //     "messages": [],
  //     "filterStats": {
  //       "duration": {
  //         "min": 90,
  //         "max": 95,
  //         "multiCityMin": 180,
  //         "multiCityMax": 185
  //       },
  //       "airports": [
  //         {
  //           "city": "Brisbane",
  //           "airports": [
  //             {
  //               "id": "BNE",
  //               "entityId": "95673551",
  //               "name": "Brisbane"
  //             }
  //           ]
  //         },
  //         {
  //           "city": "Sydney",
  //           "airports": [
  //             {
  //               "id": "SYD",
  //               "entityId": "128667058",
  //               "name": "Sydney"
  //             }
  //           ]
  //         }
  //       ],
  //       "carriers": [
  //         {
  //           "id": -32166,
  //           "alternateId": "JQ",
  //           "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/JQ.png",
  //           "name": "Jetstar",
  //           "allianceId": 0
  //         },
  //         {
  //           "id": -31940,
  //           "alternateId": "QF",
  //           "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/QF.png",
  //           "name": "Qantas",
  //           "allianceId": 0
  //         },
  //         {
  //           "id": -31694,
  //           "alternateId": "V1",
  //           "logoUrl": "https://logos.skyscnr.com/images/airlines/favicon/V1.png",
  //           "name": "Virgin Australia",
  //           "allianceId": 0
  //         }
  //       ],
  //       "stopPrices": {
  //         "direct": {
  //           "isPresent": true,
  //           "formattedPrice": "$272"
  //         },
  //         "one": {
  //           "isPresent": false
  //         },
  //         "twoOrMore": {
  //           "isPresent": false
  //         }
  //       },
  //       "alliances": []
  //     },
  //     "flightsSessionId": "cfaa867c-f684-44ab-af38-5b6b0ee4c293",
  //     "destinationImageUrl": "https://content.skyscnr.com/m/3719e8f4a5daf43d/original/Flights-Placeholder.jpg",
  //     "token": "eyJhIjoxLCJjIjowLCJpIjowLCJjYyI6ImVjb25vbXkiLCJvIjoiU1lEIiwiZCI6IkJORSIsImQxIjoiMjAyNS0wNy0wNCIsImQyIjoiMjAyNS0wNy0wNyJ9"
  //   },
  //   "status": true,
  //   "message": "Successful"
    
  // }


  //function to create detailed itenary
  const search = async (from, to, startDate, endDate) => {
    console.log(from, to, startDate, endDate);

    localStorage.setItem("destination", to)
    if (!from || !to) {
      console.log("input data");
      toast.error("Please select a destination and your current location.");
      return;
    }

    // Validate date range (at least 1 day apart)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      toast.error("Please select an end date at least 1 day after the start date.");
      return;
    }
    setLoadingG(true)


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

    

  } catch (error) {
    console.error("Error fetching flights", error);
    toast.error("Something went wrong while fetching flights or events.");
  }
  
  try {
     // Build input including flight
    const input = {
      from,
      to,
      startDate,
      endDate,
      flight:{flight},
      hotel:hotel
    };

    // Now call OpenAI with updated input
    const openAIRes = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const openAIData = await openAIRes.json();
    console.log("OpenAI Response:", openAIData);
    setDailyActivities(openAIData);
    
  } 
  catch (error) {
    toast.error("Error generating itenary");

  }
  finally{
    setLoadingG(false)
  }
 

  }


  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-6">
      <div className="flex items-center justify-between rounded-full shadow-md px-4 py-6 gap-2 flex-wrap">
        {/* Leaving From */}
        <div ref={wrapperRef} className="flex relative items-center gap-2 flex-1 min-w-[150px] md:ml-5">
          <FaMapMarkerAlt className="text-gray-500 " size={25}/>
          {/* <div className="w-full">
            <select
                className="w-full border border-gray-300 rounded-xl p-2"
                value={curLocation}
                onChange={(e) => setCurLocation(e.target.value)}
            >
                <option value="">Current location</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>
                        {loc}
                        </option>
                    ))}
          </select>

        </div> */}

            <input
                type="text"
                placeholder="Current location"
                value={query || curLocation}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  setShowDropdown(true);
                  setCurLocation("")
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 rounded-xl p-2"
              />

            {showDropdown && results.length > 0 && (
              <ul className="absolute top-10 z-10 left-7 w-[80%] bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-md">
                {results.map((loc) => (
                  <li
                    key={loc}
                    onClick={() => {
                      setCurLocation(loc);
                      setQuery('');
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handleGeolocation}
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer"
            >
              <TbCurrentLocation size={20} />
            </button>
          </div>

  

        {/* Going To Destination */}
        <div className="flex relative items-center gap-2 flex-1 min-w-[150px]" ref={destinationRef}>
          <FaMapMarkerAlt className="text-gray-500" size={25}/>
          {/* <div className="w-full">
          
            <select
              className="w-full border border-gray-300 rounded-xl p-2"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">Destination</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
        
          </div> */}
          <input
        type="text"
        placeholder="Destination"
        value={queryDestination || destination}
        onChange={(e) => {
          const value = e.target.value;
          setQueryDestination(value);
          setDestination('');
          setShowDropdownDestination(true);
        }}
        onFocus={() => setShowDropdownDestination(true)}
        className="w-full border border-gray-300 rounded-xl p-2"
      />

      {showDropdownDestination && filteredResults.length > 0 && (
        <ul className="absolute top-10 z-10 left-7 w-[80%] bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-md">
          {filteredResults.map((loc) => (
            <li
              key={loc}
              onClick={() => {
                setDestination(loc);
                setQueryDestination('');
                setShowDropdownDestination(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm"
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px] justify-center">
          <FaCalendarAlt className="text-gray-500 me-1.5" size={25}/>
          <DatePicker
            selected={startDate}
            minDate={addDays(new Date(), 1)}         // Start from tomorrow
            maxDate={addDays(startDate, 15)} 
            onChange={(dates) => {
              const [start, end] = dates ;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            className="bg-transparent outline-none w-full cursor-pointer"
            placeholderText="Select dates"
          />
        </div>

        {/* Search Button */}
        <button className="button-primary font-semibold mr-4" onClick={()=> search(curLocation,destination,startDate,endDate)}>
          Search
        </button>
      </div>
      
    </div>
  );
}
