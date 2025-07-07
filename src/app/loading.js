    "use client"
    
    import React from 'react';
    import dynamic from 'next/dynamic';

    // Dynamically import DotLottieReact with ssr: false
    const DotLottieReact = dynamic(
      () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
      { ssr: false }
    );

    const loading = () => {
      return (
        <DotLottieReact
          src="/loading.lottie" // Path to your .lottie file in the `public` directory
          loop
          autoplay
          style={{ width: '300px', height: '300px' }} // Optional styling
        />
      );
    };

    export default loading;