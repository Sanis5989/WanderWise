import React from 'react'
import Navbar from './Navbar'
import LocationPicker from './LocationPicker'

export default function HomePage() {
  return (
    
    <div>
      {/* Navbar */}
      <Navbar/>

      <div>
        <LocationPicker/>
      </div>
      HomePage
    </div>
  )
}
