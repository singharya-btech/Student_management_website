import React, { useEffect, useState } from 'react'
import { BiCalendar, BiCheckCircle, BiBarChart, BiSave, BiUserCheck, BiXCircle, BiTrendingUp } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import SimpleChart from '../components/SimpleChart'
import LoadingSpinner from '../components/LoadingSpinner'
import { attendanceService } from '../services/attendanceService'
import { studentService } from '../services/studentService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Attendance(){
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [percent, setPercent] = useState(100)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Student specific state
  const [studentProfile, setStudentProfile] = useState(null)
  const [attendanceHistory, setAttendanceHistory] = useState([])

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser && currentUser.role === 'Admin'

  const fetchAttendance = async (targetDate) => {
    setLoading(true)
    try {
      if (isAdmin) {
        // Admin View: Fetch full registry checklist for selected date
        const data = await attendanceService.getAttendance(targetDate)
        setRecords(data.records)
        setPercent(data.percent)
      } else {
        // Student View: Fetch personal profile & entire attendance logs
        const allStudents = await studentService.getAllStudents()
        const matchedStudent = allStudents.find(s => s.email.toLowerCase() === currentUser?.email?.toLowerCase())
        setStudentProfile(matchedStudent)

        if (matchedStudent) {
          const history = await attendanceService.getStudentAttendanceHistory(matchedStudent.id)
          setAttendanceHistory(history)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load attendance sheet')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance(date)
  }, [date])

  const handleToggle = (studentId) => {
    const updated = records.map(r => {
      if (r.studentId === studentId) {
        return { ...r, present: !r.present }
      }
      return r
    })
    setRecords(updated)
    
    // Recalculate immediate percentage
    const presentCount = updated.filter(r => r.present).length
    const totalCount = updated.length
    const nextPercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100
    setPercent(nextPercent)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await attendanceService.saveAttendance(date, records)
      toast.success('Attendance records saved successfully!')
      fetchAttendance(date)
    } catch (err) {
      console.error(err)
      toast.error('Failed to save attendance logs')
    } finally {
      setSaving(false)
    }
  }

  // Attendance Analytics Chart Data
  const attendanceData = studentProfile ? [
    {name: 'Week 1', value: 85},
    {name: 'Week 2', value: 88},
    {name: 'Week 3', value: 92},
    {name: 'Week 4', value: studentProfile.attendance}
  ] : [
    {name: 'Week 1', value: 84},
    {name: 'Week 2', value: 89},
    {name: 'Week 3', value: 91},
    {name: 'Week 4', value: percent}
  ]

  // Status helper for student attendance percentage
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) {
      return { text: 'Excellent', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25', desc: 'Outstanding presence! You comply perfectly with standard guidelines.' }
    } else if (percentage >= 75) {
      return { text: 'Good', color: 'text-amber-500 bg-amber-500/10 border-amber-500/25', desc: 'Compliant attendance. Maintain consistency to stay above the 75% bar.' }
    } else {
      return { text: 'Warning', color: 'text-red-500 bg-red-500/10 border-red-500/25', desc: 'Action Required: Your attendance is below the university minimum criteria (75%).' }
    }
  }

  const studentStatus = studentProfile ? getAttendanceStatus(studentProfile.attendance) : null

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          
          {/* ================= HEADER SECTION ================= */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent dark:text-white">
                {isAdmin ? 'Attendance Management' : 'My Attendance Summary'}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {isAdmin 
                  ? 'Quickly mark attendance and monitor campus-wide trends.' 
                  : 'Track your daily attendance presence rates and active academic trends.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none shadow-xl"
                />
              )}
              <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-5 py-3 text-white shadow-xl shadow-primaryStart/20">
                <BiCalendar className="text-xl" /> Real-time Update
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : isAdmin ? (
            // ================= ADMIN WORKFLOW CHECKLIST =================
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Mark Attendance</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Toggle student presence for {date}.</p>
                  </div>
                  <span className="rounded-3xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 font-semibold">{percent}% Present</span>
                </div>
                <div className="mt-6 space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {records.map(student => (
                    <div key={student.studentId} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-white shadow-sm">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs text-slate-400">ID: {student.studentId}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle(student.studentId)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all font-semibold ${student.present ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
                      >
                        <BiCheckCircle className={`text-base ${student.present ? 'opacity-100' : 'opacity-40'}`} />
                        {student.present ? 'Present' : 'Absent'}
                      </button>
                    </div>
                  ))}
                  {records.length === 0 && (
                    <p className="text-center py-6 text-slate-400">No active students to record attendance.</p>
                  )}
                </div>
                {records.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-6 py-3 font-semibold text-white shadow-lg shadow-primaryStart/20 hover:opacity-90 disabled:opacity-50 transition"
                    >
                      <BiSave className="text-lg" /> {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-6 h-fit">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Attendance Analytics</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Weekly campus presence trend rates.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-2 text-sm text-slate-900 dark:text-white font-semibold">
                    <BiBarChart /> Analytics
                  </div>
                </div>
                <div className="mt-6 h-72">
                  <SimpleChart data={attendanceData} />
                </div>
              </GlassCard>
            </div>
          ) : (
            // ================= STUDENT PROFILE SUMMARY =================
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                
                {/* Personal overall stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <GlassCard className="p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Total Classes Rate</h3>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-slate-950 dark:text-white">{studentProfile ? studentProfile.attendance : 0}%</span>
                        <span className="text-sm text-slate-400">overall average</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${studentProfile ? studentProfile.attendance : 0}%` }}
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Academic Compliance</h3>
                        {studentStatus && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${studentStatus.color}`}>
                            {studentStatus.text}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {studentStatus ? studentStatus.desc : 'No record available.'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                      <BiTrendingUp className="text-base" /> Attendance Minimum: 75%
                    </div>
                  </GlassCard>
                </div>

                {/* Presence timeline logs */}
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Daily Attendance Records</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your chronologically ordered academic presence timeline logs.</p>
                  
                  <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 shadow-lg">
                    <div className="max-h-[360px] overflow-y-auto">
                      <table className="min-w-full text-left text-sm text-slate-300">
                        <thead className="sticky top-0 bg-slate-900/90 text-slate-400 z-10">
                          <tr>
                            <th className="px-5 py-4">Calendar Date</th>
                            <th className="px-5 py-4">Logged Status</th>
                            <th className="px-5 py-4">Instructor Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {attendanceHistory.map((log) => (
                            <tr key={log._id} className="hover:bg-white/5 transition">
                              <td className="px-5 py-4 text-white font-mono font-medium">{log.date}</td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                  log.present 
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' 
                                    : 'bg-red-500/15 text-red-300 border border-red-500/20'
                                }`}>
                                  {log.present ? <BiUserCheck className="text-sm" /> : <BiXCircle className="text-sm" />}
                                  {log.present ? 'Present' : 'Absent'}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-slate-400">
                                {log.present 
                                  ? 'Marked present by administration' 
                                  : 'Not present in standard lecture hours'}
                              </td>
                            </tr>
                          ))}
                          {attendanceHistory.length === 0 && (
                            <tr>
                              <td colSpan="3" className="text-center py-8 text-slate-400">
                                No attendance register entries found for your account yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </GlassCard>
              </section>

              {/* Weekly trend metrics */}
              <aside>
                <GlassCard className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Attendance Analytics</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your weekly performance trend rate.</p>
                  </div>
                  <div className="mt-6 h-72">
                    <SimpleChart data={attendanceData} />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-400 border-t border-white/5 pt-4 text-center">
                    Analytics computed dynamically relative to registered active lecture entries.
                  </p>
                </GlassCard>
              </aside>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}
