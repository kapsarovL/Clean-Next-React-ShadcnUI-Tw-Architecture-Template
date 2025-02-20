"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    setTheme(savedTheme || (prefersDark ? "dark" : "light"))
  }, [])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  return { theme, setTheme }
}