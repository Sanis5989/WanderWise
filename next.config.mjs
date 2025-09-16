/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins:['local-origin.dev', '*.local-origin.dev','http://192.168.*.*:3000',],
    images: {
        remotePatterns: [
          {
            protocol: 'https', // Or 'http' if necessary
            hostname: 'cf.bstatic.com', // Replace with your allowed domain
            port: '',
            pathname: '/**', // Allows any path on this domain
          },
          {
            protocol: 'https',
            hostname: 'cf.bstatic.com', // Add more allowed domains as needed
          },
          {
            protocol: 'https',
            hostname:'logos.skyscnr.com'
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
          }
        ],
      },
};

export default nextConfig;
