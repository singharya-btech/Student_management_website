import React, { useEffect, useState } from 'react'
import { BiCamera, BiEdit } from 'react-icons/bi'
import { FiClock, FiStar, FiMail, FiPhone, FiLock, FiSettings, FiActivity, FiUsers, FiBookOpen, FiBell } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import GlassCard from '../components/GlassCard'
import PageTransition from '../components/PageTransition'
import SimpleChart from '../components/SimpleChart'
import LoadingSpinner from '../components/LoadingSpinner'
import { studentService } from '../services/studentService'
import { courseService } from '../services/courseService'
import { noticeService } from '../services/noticeService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Profile(){
  const [student, setStudent] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [systemStats, setSystemStats] = useState({ students: 0, courses: 0, notices: 0 })
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const user = authService.getCurrentUser()
      const allStudents = await studentService.getAllStudents()
      
      if (user && user.role === 'Admin') {
        setIsAdmin(true)
        setAdminUser(user)
        
        let courseCount = 0
        let noticeCount = 0
        try {
          const courses = await courseService.getAllCourses()
          courseCount = courses.length
        } catch (e) {
          console.error(e)
        }
        try {
          const notices = await noticeService.getAllNotices()
          noticeCount = notices.length
        } catch (e) {
          console.error(e)
        }

        setSystemStats({
          students: allStudents.length,
          courses: courseCount,
          notices: noticeCount
        })
      } else {
        setIsAdmin(false)
        let matchedStudent = allStudents.find(s => s.email.toLowerCase() === user?.email?.toLowerCase())
        if (!matchedStudent && allStudents.length > 0) {
          matchedStudent = allStudents[0]
        }
        setStudent(matchedStudent)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load profile details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const studentActivity = [
    {text: 'Submitted final project: "Adaptive Neural Net"', time: '2h ago'},
    {text: 'Attendance marked: Present (Lecture)', time: '1d ago'},
    {text: 'Paid semester fees', time: '3d ago'},
    {text: 'Joined AI study group', time: '1 week ago'}
  ]

  const adminActivity = [
    {text: 'Database seeded and user accounts initialized', time: 'Just now'},
    {text: 'API Server running on port 5000', time: '5m ago'},
    {text: 'Vite React Frontend server started on port 3000', time: '10m ago'},
    {text: 'MongoDB Atlas instance connected', time: '15m ago'}
  ]

  const attendanceData = student ? [
    {name: 'Week 1', value: 88},
    {name: 'Week 2', value: 92},
    {name: 'Week 3', value: 95},
    {name: 'Week 4', value: student.attendance}
  ] : []

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : isAdmin ? (
            // ================= ADMIN PROFILE VIEW =================
            <>
              <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-800 via-indigo-800 to-slate-900 p-8 text-white shadow-neon-glow border border-purple-500/20">
                <div className="absolute right-6 top-6 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-medium opacity-90">Welcome back, {adminUser.username.charAt(0).toUpperCase() + adminUser.username.slice(1)} 👋</h3>
                    <h1 className="mt-2 text-4xl font-bold">System Administrator</h1>
                    <p className="mt-1 text-sm opacity-90">Institutional Admin Account — Full Control & System Oversight</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">Role: <strong className="text-cyan-300">Admin</strong></span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">Privilege: <strong className="text-pink-300">Superuser</strong></span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">System Status: <strong className="text-emerald-300">Healthy</strong></span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-6 lg:mt-0">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 text-4xl font-bold text-white shadow-xl shadow-purple-500/30">
                      {adminUser.username.charAt(0).toUpperCase()}
                      <button className="absolute -bottom-2 right-0 rounded-full bg-white p-2 text-purple-700 shadow-md"><BiCamera /></button>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="text-sm opacity-90">Status</div>
                      <div className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-sm font-semibold uppercase tracking-wider">Active</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section>
                  <GlassCard className="p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">System Statistics Overview</h2>
                      <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"><FiSettings /> Manage</button>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-900/80 p-5 text-white border border-purple-500/10 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Students</span>
                          <FiUsers className="text-lg text-purple-400" />
                        </div>
                        <div className="mt-3 text-3xl font-bold">{systemStats.students}</div>
                        <div className="text-xs mt-1 text-slate-400">Total enrolled profiles</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/80 p-5 text-white border border-purple-500/10 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Courses</span>
                          <FiBookOpen className="text-lg text-pink-400" />
                        </div>
                        <div className="mt-3 text-3xl font-bold">{systemStats.courses}</div>
                        <div className="text-xs mt-1 text-slate-400">Active class catalogs</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/80 p-5 text-white border border-purple-500/10 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Notices</span>
                          <FiBell className="text-lg text-cyan-400" />
                        </div>
                        <div className="mt-3 text-3xl font-bold">{systemStats.notices}</div>
                        <div className="text-xs mt-1 text-slate-400">Announcements posted</div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">Administrative Access Privileges</h3>
                    <p className="mt-2 text-sm text-slate-500">Your account is granted full system management policies:</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-purple-500/10 p-4">
                        <div className="h-2 w-2 rounded-full bg-purple-400 mt-2"></div>
                        <div>
                          <h4 className="text-sm font-semibold">Student Database Control</h4>
                          <p className="text-xs text-slate-400 mt-1">Complete creation, updating, and removal controls over student accounts.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-purple-500/10 p-4">
                        <div className="h-2 w-2 rounded-full bg-pink-400 mt-2"></div>
                        <div>
                          <h4 className="text-sm font-semibold">Notice Board Management</h4>
                          <p className="text-xs text-slate-400 mt-1">Authorized access to post, categorize, and delete news board notifications.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-purple-500/10 p-4">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 mt-2"></div>
                        <div>
                          <h4 className="text-sm font-semibold">Attendance Log Marking</h4>
                          <p className="text-xs text-slate-400 mt-1">Override capabilities to track and record daily attendance registers.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-white/5 border border-purple-500/10 p-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 mt-2"></div>
                        <div>
                          <h4 className="text-sm font-semibold">Fee Ledgers & Billings</h4>
                          <p className="text-xs text-slate-400 mt-1">Authorized access to monitor fees statuses and register invoices.</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </section>

                <aside>
                  <GlassCard className="p-6 mb-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">Account Details</h3>
                    <p className="mt-3 text-sm text-slate-500">Security and authentication attributes.</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-900/60 p-2 text-white"><FiMail /></div>
                        <div>
                          <div className="text-sm font-medium">Administrator Email</div>
                          <div className="text-xs text-slate-400">{adminUser.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-900/60 p-2 text-white"><FiLock /></div>
                        <div>
                          <div className="text-sm font-medium">Authentication Type</div>
                          <div className="text-xs text-slate-400">JWT Encrypted Bearer Token</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-900/60 p-2 text-white"><FiClock /></div>
                        <div>
                          <div className="text-sm font-medium">Session State</div>
                          <div className="text-xs text-emerald-400 font-mono font-semibold">Active</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">System Activity Logs</h3>
                    <div className="mt-4 space-y-4">
                      {adminActivity.map((a, i)=> (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 h-2 w-2 rounded-full bg-purple-400/80 animate-ping" />
                          <div>
                            <div className="text-sm text-slate-800 dark:text-slate-200">{a.text}</div>
                            <div className="text-xs text-slate-400 mt-1">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </aside>
              </div>
            </>
          ) : !student ? (
            // ================= FALLBACK NO STUDENT =================
            <GlassCard className="p-6 text-center text-slate-400">
              No student profile found. Please make sure database seeding was completed.
            </GlassCard>
          ) : (
            // ================= STUDENT PROFILE VIEW =================
            <>
              <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-sky-700 p-8 text-white shadow-neon-glow">
                <div className="absolute right-6 top-6 h-44 w-44 rounded-full bg-white/5 blur-3xl" />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-medium opacity-90">Welcome back, {student.name.split(' ')[0]} 👋</h3>
                    <h1 className="mt-2 text-4xl font-bold">{student.name}</h1>
                    <p className="mt-1 text-sm opacity-90">Engineering Student — {student.department} • {student.semester}th Semester</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">GPA: <strong className="ml-1">{student.gpa}</strong></span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">Attendance: <strong className="ml-1">{student.attendance}%</strong></span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">Semester: <strong className="ml-1">{student.semester}th</strong></span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-6 lg:mt-0">
                    <div className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${student.color || 'from-purple-400 to-pink-400'} text-4xl font-bold text-white shadow-lg`}>
                      {student.avatar || student.name.charAt(0).toUpperCase()}
                      <button className="absolute -bottom-2 right-0 rounded-full bg-white p-2 text-purple-700 shadow-md"><BiCamera /></button>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="text-sm opacity-90">Status</div>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold uppercase tracking-wider">{student.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section>
                  <GlassCard className="p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Academic Performance</h2>
                      <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"><BiEdit /> Edit</button>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl bg-slate-900/80 p-4 text-white">
                        <div className="text-sm">GPA</div>
                        <div className="mt-2 text-2xl font-bold">{student.gpa}</div>
                        <div className="text-xs mt-1 text-slate-300">Cumulative performance</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/80 p-4 text-white">
                        <div className="text-sm">Credits Completed</div>
                        <div className="mt-2 text-2xl font-bold">140</div>
                        <div className="text-xs mt-1 text-slate-300">Degree progress</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900/80 p-4 text-white">
                        <div className="text-sm">Fees Status</div>
                        <div className="mt-2 text-2xl font-bold">{student.fees_status}</div>
                        <div className="text-xs mt-1 text-slate-300">{student.fees_status === 'Paid' ? 'All dues cleared' : 'Outstanding balance'}</div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">Attendance Analytics</h3>
                    <p className="mt-2 text-sm text-slate-500">Weekly attendance trend</p>
                    <div className="mt-6 h-56">
                      <SimpleChart data={attendanceData} />
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Skills</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {student.skills.map((s, i)=> (
                        <span key={i} className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs text-white shadow-sm">{s}</span>
                      ))}
                      {student.skills.length === 0 && (
                        <span className="text-sm text-slate-400">No skills listed yet.</span>
                      )}
                    </div>
                  </GlassCard>
                </section>

                <aside>
                  <GlassCard className="p-6 mb-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">Contact</h3>
                    <p className="mt-3 text-sm text-slate-500">Reach out to the student via email or phone.</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-900/60 p-2 text-white"><FiMail /></div>
                        <div>
                          <div className="text-sm font-medium">Email</div>
                          <div className="text-xs text-slate-400">{student.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-slate-900/60 p-2 text-white"><FiPhone /></div>
                        <div>
                          <div className="text-sm font-medium">Phone</div>
                          <div className="text-xs text-slate-400">{student.phone}</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6 text-slate-900 dark:text-white">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <div className="mt-4 space-y-4">
                      {studentActivity.map((a, i)=> (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-purple-400/80" />
                          <div>
                            <div className="text-sm text-slate-800 dark:text-slate-200">{a.text}</div>
                            <div className="text-xs text-slate-400 mt-1">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </PageTransition>
  )
}
