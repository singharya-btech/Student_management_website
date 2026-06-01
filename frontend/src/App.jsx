import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Courses from './pages/Courses'
import Attendance from './pages/Attendance'
import Fees from './pages/Fees'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NoticeBoard from './pages/NoticeBoard'
import NotFound from './pages/NotFound'
import { authService } from './services/authService'

export default function App(){
  const [dark, setDark] = useState(false)
  const location = useLocation()

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
  },[dark])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard dark={dark} setDark={setDark}/></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/notices" element={<PrivateRoute><NoticeBoard /></PrivateRoute>} />
          <Route path="/fees" element={<PrivateRoute><Fees /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings dark={dark} setDark={setDark}/></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

function PrivateRoute({ children }){
  const isAuth = authService.isAuthenticated()
  return isAuth ? children : <Navigate to="/login" replace />
}
