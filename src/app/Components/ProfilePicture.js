// app/components/ProfilePicture.js
'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilePicture() {
  const { data: session, status } = useSession();

  // Handle the loading state
  if (status === 'loading') {
    // You can return a skeleton loader here
    return <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>;
  }

  // Only render the image if the user is authenticated
  if (status === 'authenticated') {
    return (
      <Image
        src={session.user.image}
        alt={session.user.name || 'User profile picture'}
        width={40}
        height={40}
        className="rounded-full"
      />
    );
  }

  // Return null or a placeholder if not authenticated
  return null;
}