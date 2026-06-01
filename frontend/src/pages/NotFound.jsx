import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2">Page not found</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-primaryStart text-white rounded">Go Home</Link>
      </div>
    </div>
  )
}
