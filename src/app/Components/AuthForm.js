// This is a client component because it uses hooks (useState) and event handlers
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import the Google icon
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { signIn } from 'next-auth/react';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoogleSignIn = () => {
    // This function tells NextAuth to start the Google OAuth flow.
    // After a successful login, the user will be sent to the homepage ('/').
    signIn('google', { callbackUrl: '/' });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError(''); // Clear previous errors
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    
    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      // If login or registration is successful, redirect to homepage
      window.location.href = '/'; 

    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg"
    >
      {/* The animated toggle switch */}
      <div className="relative flex justify-center p-1 rounded-full bg-gray-100">
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`absolute inset-0 w-1/2 rounded-full bg-blue-500 shadow-md ${
            isSignUp ? 'left-1/2' : 'left-0'
          }`}
        />
        <button
          onClick={() => setIsSignUp(false)}
          className={`cursor-pointer relative z-10 w-1/2 py-2 text-center rounded-full transition-colors duration-300 ${
            !isSignUp ? 'text-white' : 'text-gray-600'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`cursor-pointer relative z-10 w-1/2 py-2 text-center rounded-full transition-colors duration-300 ${
            isSignUp ? 'text-white' : 'text-gray-600'
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h1>
        <p className="text-gray-500">
          {isSignUp ? 'Let’s get you started!' : 'Log in to continue your journey.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* AnimatePresence handles the enter/exit animation of the Name field */}
        <AnimatePresence>
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name='name'
                placeholder="Full Name"
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name='email'
            placeholder="Email Address"
            className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
          name='password'
            type="password"
            placeholder="Password"
            className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="cursor-pointer w-full py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {isSignUp ? 'Create Account' : 'Log In'}
        </motion.button>
      </form>

      {/* ---- NEW: Divider ---- */}
      <div className="flex items-center gap-4">
        <div className="w-full h-px bg-gray-200"></div>
        <span className="text-sm text-gray-400 uppercase">OR</span>
        <div className="w-full h-px bg-gray-200"></div>
      </div>

      {/* ---- NEW: Google Sign-In Button ---- */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        type="button" // Important: type="button" prevents it from submitting the form
        className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </motion.button>
    </motion.div>
  );
}