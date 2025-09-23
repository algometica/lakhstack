"use client"

import React from 'react'
import { Crown, Star, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const PremiumBadge = ({ 
  className, 
  size = "default",
  variant = "default",
  showText = true,
  ...props 
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4", 
    lg: "w-5 h-5"
  }

  const variants = {
    default: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg",
    outline: "border-2 border-pink-500 text-pink-500 bg-transparent",
    subtle: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
    glow: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Premium Icon */}
      <div className="relative">
        <Crown className={cn(iconSizes[size], "fill-current")} />
        <Sparkles className={cn(
          "absolute -top-1 -right-1 fill-current text-pink-300",
          size === "sm" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-2.5 h-2.5"
        )} />
      </div>
      
      {/* Premium Text */}
      {showText && (
        <span className="font-bold tracking-wide">
          Premium
        </span>
      )}
    </div>
  )
}

// Alternative badge with star icon
const PremiumStarBadge = ({ 
  className, 
  size = "default",
  variant = "default",
  showText = true,
  ...props 
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    default: "w-4 h-4", 
    lg: "w-5 h-5"
  }

  const variants = {
    default: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg",
    outline: "border-2 border-pink-500 text-pink-500 bg-transparent",
    subtle: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
    glow: "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Premium Star Icon */}
      <div className="relative">
        <Star className={cn(iconSizes[size], "fill-current")} />
        <Sparkles className={cn(
          "absolute -top-1 -right-1 fill-current text-rose-300",
          size === "sm" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-2.5 h-2.5"
        )} />
      </div>
      
      {/* Premium Text */}
      {showText && (
        <span className="font-bold tracking-wide">
          Premium
        </span>
      )}
    </div>
  )
}

// Compact premium indicator (just icon)
const PremiumIcon = ({ 
  className, 
  size = "default",
  ...props 
}) => {
  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-5 h-5", 
    lg: "w-6 h-6"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transition-all duration-300 hover:scale-110",
        size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6",
        className
      )}
      {...props}
    >
      <Crown className={cn(iconSizes[size], "fill-current")} />
    </div>
  )
}

export { PremiumBadge, PremiumStarBadge, PremiumIcon }
