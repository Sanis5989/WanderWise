'use client'
import { useTheme } from "../Providers/ThemeProvider"
import { MdLightMode ,MdDarkMode } from "react-icons/md";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme} className="mb-7">
      {theme === 'light' ?  <MdDarkMode  color="#ffbf29" size={30}/> :<MdLightMode color="#ffbf29" size={30}/>}
    </button>
  )
}