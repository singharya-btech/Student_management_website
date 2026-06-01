import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'
import { BiTrendingUp, BiBookOpen, BiCalendarCheck, BiCreditCard } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import GlassCard from '../components/GlassCard'
import PageTransition from '../components/PageTransition'
import LoadingSpinner from '../components/LoadingSpinner'
import { studentService } from '../services/studentService'
import { courseService } from '../services/courseService'
import { paymentService } from '../services/paymentService'
import { attendanceService } from '../services/attendanceService'
import { toast } from 'react-hot-toast'

export default function Dashboard({dark, setDark}){
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([])

  const fetchDashboardStats = async () => {
    try {
      // Fetch data in parallel
      const [students, courses, paymentsData, attendanceData] = await Promise.all([
        studentService.getAllStudents(),
        courseService.getAllCourses(),
        paymentService.getAllPayments(),
        attendanceService.getAttendance()
      ])

      const totalStudents = students.length
      const activeCourses = courses.length
      const attendanceRate = `${attendanceData.percent}%`
      const feesCollected = paymentsData.stats.totalCollected

      setStats([
        {label: 'Total Students', value: totalStudents.toString(), change: '+8.4%', icon: <BiTrendingUp />},
        {label: 'Courses Active', value: activeCourses.toString(), change: '+1.7%', icon: <BiBookOpen />},
        {label: 'Attendance Rate', value: attendanceRate, change: '+2.3%', icon: <BiCalendarCheck />},
        {label: 'Fees Collected', value: feesCollected, change: '+4.1%', icon: <BiCreditCard />}
      ])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load live dashboard statistics')
      
      // Keep static fallbacks in case server isn't run yet
      setStats([
        {label: 'Total Students', value: '1,256', change: '+8.4%', icon: <BiTrendingUp />},
        {label: 'Courses Active', value: '42', change: '+1.7%', icon: <BiBookOpen />},
        {label: 'Attendance Rate', value: '93.8%', change: '+2.3%', icon: <BiCalendarCheck />},
        {label: 'Fees Collected', value: '$84.2k', change: '+4.1%', icon: <BiCreditCard />}
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const attendanceChartData = [
    {name: 'Mon', value: 78},
    {name: 'Tue', value: 85},
    {name: 'Wed', value: 88},
    {name: 'Thu', value: 92},
    {name: 'Fri', value: 95},
    {name: 'Sat', value: 91},
    {name: 'Sun', value: 90}
  ]

  const activities = [
    {title: 'New student enrolled in Data Science', time: '2m ago'},
    {title: 'Semester grades published', time: '1h ago'},
    {title: 'Fee payment completed for 12 students', time: '4h ago'}
  ]

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar onToggleDark={()=> setDark(d=>!d)} onOpenNotifications={()=>{}} />
        <main className="relative px-6 pb-10 pt-6 lg:px-10">
          <div className="absolute -right-10 top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute left-0 top-96 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
          
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-4">
                {stats.map((item, index)=>(
                  <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.5 }}>
                    <StatCard {...item} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Attendance Overview</h2>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Live weekly attendance insights for your institutions.</p>
                    </div>
                    <span className="rounded-2xl bg-gradient-to-r from-primaryStart to-primaryEnd px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-primaryStart/20">Good</span>
                  </div>
                  <div className="mt-8 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid opacity={0.08} vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 18 }} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
                        <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fill="url(#attendanceGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                  <ul className="mt-6 space-y-4">
                    {activities.map((activity, idx)=>(
                      <li key={idx} className="rounded-3xl border border-white/10 bg-slate-50/80 p-4 text-sm text-slate-600 shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
                        <div className="font-semibold text-slate-900 dark:text-white">{activity.title}</div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{activity.time}</div>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </>
          )}
        </main>
      </div>
    </PageTransition>
  )
}
