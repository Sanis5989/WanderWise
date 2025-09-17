// app/mytrips/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Navbar from '../Components/Navbar';

export default function MyTripsPage() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch plans if the user is authenticated
    if (status === 'authenticated') {
      const fetchPlans = async () => {
        try {
          const res = await fetch('/api/plans');
          if (!res.ok) {
            throw new Error('Failed to fetch plans.');
          }
          const data = await res.json();
          setPlans(data.plans);
        } catch (err) {
          setError(err.message);
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPlans();
    } else if (status === 'unauthenticated') {
      // If user is not logged in, stop loading
      setLoading(false);
    }
  }, [status]); // Re-run the effect when authentication status changes

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    const promise = fetch(`/api/plans/${planId}`, { method: 'DELETE' });

    toast.promise(promise, {
        loading: 'Deleting trip...',
        success: (res) => {
            if (!res.ok) throw new Error('Failed to delete.');
            // Remove the deleted plan from the state to update the UI instantly
            setPlans(plans.filter(p => p._id !== planId));
            return 'Trip deleted successfully!';
        },
        error: 'Could not delete trip.'
    });
  };

  if (loading) {
    return <div className="text-center p-10">Loading your trips...</div>;
  }
  
  if (status === 'unauthenticated') {
      return <div className="text-center p-10">Please log in to see your trips.</div>
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
  <><Navbar/>
    <div className="container mx-auto p-4 sm:p-6">
      
      <h1 className="text-3xl font-bold my-6">My Saved Trips</h1>
      {plans.length > 0 ? (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
              <div>
                <Link href={`/mytrips/${plan._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                  {plan.title}
                </Link>
                <p className="text-gray-500">
                  Created on: {format(new Date(plan.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(plan._id)}
                className="px-4 py-2 cursor-pointer text-md font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven&apos;t saved any trips yet. Go generate one!</p>
      )}
    </div>
    </>
  );
}