// app/components/ProfileMenu.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePicture() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);


  if (status === 'loading') {
    return <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="relative" ref={menuRef}>
        {/* Profile Picture Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <Image
            src={session.user.image}
            alt={session.user.name || 'User profile picture'}
            width={50}
            height={50}
            className="rounded-full mx-6"
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <div className="px-4 py-2 text-sm text-gray-700">
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
            <div className="border-t border-gray-100"></div>
            <button
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
             My Trips
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Sign Out
            </button>
            
          </div>
        )}
      </div>
    );
  }

  return null; // Don't render anything if not logged in
}