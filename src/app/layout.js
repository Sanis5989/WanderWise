import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import AuthProvider from "../app/Providers/AuthProvider"

const montserrat = Inter({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weights: [400, 500, 600, 700], // Include weights for versatility
});

export const metadata = {
  title: "WanderWise",
  description: "Trip planer to travel Wisely",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Toaster position="center" reverseOrder={false} />
        <AuthProvider>
          <ThemeProvider>
                      {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
