"use client"

import { useState, useEffect } from "react"
import { toast as toastFn } from "./toast"

export function useToast() {
  const [isOpen, setIsOpen] = useState(false)

  const toast = (options: Parameters<typeof toastFn>[0]) => {
    setIsOpen(true)
    toastFn(options)
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 3000) // Default duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return { toast }
}