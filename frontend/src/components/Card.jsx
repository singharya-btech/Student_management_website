import React from 'react'

export default function Card({title, value, icon, className}){
  return (
    <div className={`p-4 rounded-xl bg-white/70 dark:bg-gray-800/60 shadow-sm ${className}`}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}
