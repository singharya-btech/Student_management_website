import { BiBell, BiMoon, BiSearch } from 'react-icons/bi'
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function Navbar({onToggleDark = ()=>{}, onOpenNotifications = ()=>{}}){
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [searchVal, setSearchVal] = useState('')
  
  const navigate = useNavigate()
  const currentUser = authService.getCurrentUser()
  const welcomeName = currentUser ? (currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)) : 'Guest'
  const welcomeRole = currentUser ? currentUser.role : ''
  const avatarLetter = welcomeName.charAt(0).toUpperCase()

  useEffect(()=>{
    const updateTime = ()=>{
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true}))
      setDate(now.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return ()=> clearInterval(interval)
  },[])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const q = searchVal.trim().toLowerCase()
      if (!q) return

      if (q.includes('course') || q.includes('catalog') || q.includes('class')) {
        toast.success('Navigating to Course Catalog...')
        navigate('/courses')
      } else if (q.includes('student') || q.includes('table') || q.includes('list')) {
        toast.success('Navigating to Students List...')
        navigate('/students')
      } else if (q.includes('attend') || q.includes('calendar') || q.includes('present')) {
        toast.success('Navigating to Attendance sheet...')
        navigate('/attendance')
      } else if (q.includes('notice') || q.includes('board') || q.includes('announcement') || q.includes('update')) {
        toast.success('Navigating to Notice Board...')
        navigate('/notices')
      } else if (q.includes('fee') || q.includes('pay') || q.includes('wallet') || q.includes('bill')) {
        toast.success('Navigating to Fees & Payments...')
        navigate('/fees')
      } else if (q.includes('profile') || q.includes('user') || q.includes('grade') || q.includes('gpa')) {
        toast.success('Navigating to Academic Profile...')
        navigate('/profile')
      } else if (q.includes('setting') || q.includes('theme') || q.includes('dark') || q.includes('light')) {
        toast.success('Navigating to Settings...')
        navigate('/settings')
      } else if (q.includes('dash') || q.includes('home') || q.includes('stat') || q.includes('chart')) {
        toast.success('Navigating to Dashboard...')
        navigate('/')
      } else {
        toast.error(`Page "${searchVal}" not found. Try searching 'courses', 'students', 'attendance', 'notices', or 'fees'.`, {
          duration: 3500
        })
      }
      setSearchVal('')
    }
  }

  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between gap-4 border-b border-purple-500/10 bg-gradient-to-r from-slate-950/60 via-purple-950/40 to-slate-950/60 px-6 py-4 text-white shadow-lg shadow-purple-500/5 backdrop-blur-xl md:ml-64">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold animate-fade-in">Welcome back, {welcomeName} 👋</p>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{date}</span>
          <span className="h-1 w-1 rounded-full bg-purple-400"></span>
          <span className="font-mono font-semibold text-purple-300">{time}</span>
        </div>
      </div>
      
      <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-900/60 px-4 py-3 shadow-lg shadow-slate-950/20 max-w-xs border border-purple-500/10 transition-all focus-within:border-purple-500/30 focus-within:bg-slate-900/80">
        <BiSearch className="text-lg text-slate-400" />
        <input 
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Navigate to: 'courses', 'students', 'fees'..." 
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500 text-white" 
        />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOpenNotifications} className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-slate-300 shadow-lg shadow-purple-500/5 transition hover:-translate-y-0.5 hover:bg-purple-500/20">
          <BiBell className="text-lg" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></span>
        </button>
        <button onClick={onToggleDark} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-slate-300 shadow-lg shadow-purple-500/5 transition hover:-translate-y-0.5 hover:bg-purple-500/20">
          <BiMoon className="text-lg" />
        </button>
        <div className="ml-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-4 py-2 text-white shadow-lg shadow-purple-500/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-sm font-bold text-white">{avatarLetter}</div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">{welcomeName}</div>
            <div className="text-xs text-slate-300">{welcomeRole}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
