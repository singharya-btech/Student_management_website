import React from 'react'

export default function GlassCard({children, className = ''}){
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-glow ${className}`}>
      {children}
    </div>
  )
}
