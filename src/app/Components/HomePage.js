"use client"

import React from 'react'
import Navbar from './Navbar'
import LocationPicker from './LocationPicker'
import ItineraryList from './Itinerary'
import { createContext, useState } from 'react'
import { featuredDeals } from './FeaturedCards'
import HeroSection from './HeroSection'
import FeaturedCards from './FeaturedCards'
import UseCases from './UseCases'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { addDays } from 'date-fns'

// export  const DailyActivitiesContext = createContext();

export default function HomePage() {
  const [dailyActivities,setDailyActivities] = useState();
  const router = useRouter();

  



  return (
    <div>
      {/* Navbar */}
      <Navbar/>
      <HeroSection/>
      {/* <FeaturedCards/> */}
      <div className=" pb-12 px-4 md:px-12 ">
            <h2 className="text-3xl font-bold text-center mb-8">Exciting Featured Adventure Deals for Your Next Trip</h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {featuredDeals.map((deal, index) => {
                const today = addDays(new Date(), 1)
                const params = new URLSearchParams({
                                                    source: 'home',
                                                    destination: deal?.plannerParams?.destination,
                                                    curLocation:"Brisbane",
                                                    startDate: today,
                                                    endDate: addDays(today, deal?.plannerParams?.duration)
                                                  });
                return(
                        <div key={index} 
                          className="bg-card w-[300px] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer dark:hover:shadow-gray-700"
                          onClick={() => router.push(`/Trip?${params}`)}
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
                        )
                })}
            </div>
      </div>
      {/* Usecases description */}
      <UseCases/>
    </div>
  )
}
