'use client'

import { useState } from 'react';
import React from 'react'
import ThemeToggle from './ThemeToogle'
import Image from 'next/image'
import { X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function Navbar() {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <div className='w-full flex flex-row justify-between items-center '>
          {/* Main logo on navbar */}
          <div className="relative w-[220] h-[150] cursor-pointer"  onClick={()=> router.push("/")} >
              <Image src = "/logo.png" alt="Wanderwise logo" className='md:mx-2' fill/>
          </div>
          
        {/* display login/ signup for LARGE screen */}
          <div className='hidden md:flex flex-row gap-5 mr-3.5'>
                <button className='button-secondary'>Log in</button>
                <button className='button-primary'>Sign Up</button>
                <ThemeToggle/>
          </div>

        {/* display login/ signup for SMALL screen */}

           <>
            {/* Hamburger Icon */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-10 h-10" />
            </button>

            {/* Overlay */}
            {isOpen && (
              <div
                className="fixed inset-0 bg-opacity-10 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed top-0 right-0 h-full w-64 z-50 backdrop-blur-xs transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  className="p-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <button className="button-secondary w-full">Log in</button>
                <button className="button-primary w-full">Sign Up</button>
                <ThemeToggle />
              </div>
            </div>
          </>

        </div>
    </>
  )
}
