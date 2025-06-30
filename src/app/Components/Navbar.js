import React from 'react'
import ThemeToggle from './ThemeToogle'
import Image from 'next/image'

export default function Navbar() {
  return (
    <>
        <div className='w-full flex flex-row justify-between items-center '>
            <Image src = "/logo.png" alt="Wanderwise logo" className='md:mx-2 ' width={200} height={200}/>
            <div className='flex flex-row gap-5 mr-3.5'>
                <button className='button-secondary'>Log in</button>
                <button className='button-primary'>Sign Up</button>
                <ThemeToggle/>
            </div>
            
           
        </div>
    </>
  )
}
