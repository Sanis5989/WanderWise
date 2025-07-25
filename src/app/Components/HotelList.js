'use client';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight,FaArrowCircleLeft } from "react-icons/fa";
import { DailyActivitiesContext } from '../Trip/page';

export default function HotelList({ hotels }) {
  const [current, setCurrent] = useState(0);

  const nextCard = () => {
    setCurrent((prev) => (prev + 1) % hotels.length);
  };

  const {loadingG} = useContext(DailyActivitiesContext)


  const transition = { type: 'spring', stiffness: 300, damping: 30 };

  return (
    <>
      {(hotels?.length > 1) && !loadingG ?
         <div className="relativemx-auto my-5 ">
      <div className="flex justify-between items-center px-2 ">
        <h2 className="text-2xl font-bold my-2">Top Hotels</h2>
        <div className="space-x-2 ">
          {/* <button
            onClick={prevCard}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaArrowCircleLeft/>
          </button> */}
          <button
            onClick={nextCard}
            className="cursor-pointer"
          >
            <FaArrowRight size={25} color='black' className='rounded-full p-0.5 glow-effect'/>
          </button>
        </div>
      </div>

      <div className="w-full h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={hotels[current]?.name}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={transition}
            className="absolute w-full h-full"
          >
            <div className="border border-gray-200 rounded-lg shadow-sm  bg-background overflow-hidden">
              <Image
                src={hotels[current]?.image}
                alt={hotels[current]?.name}
                width={400}
                height={250}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{hotels[current]?.name}</h3>
                <p className="text-sm text-gray-600">{hotels[current]?.location}</p>
                <p className="text-sm text-gray-600">{hotels[current]?.stayDate[0]} - {hotels[current]?.stayDate[1]} {
                  Math.ceil(
                    (new Date(hotels[current]?.stayDate[1]) - new Date(hotels[current]?.stayDate[0])) / (1000 * 60 * 60 * 24)
                  )+1
                  }{" "} days</p>
                <div className='flex items-center justify-between pt-2'>
                  <p className="font-bold my-2">
                   {hotels[current]?.price}
                  </p>
                  <a
                    href={hotels[current]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Book Now
                  </a>
                </div>
                
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div> 
    :
    <div>
      
    </div>
      }
    </>
   
  );
}
