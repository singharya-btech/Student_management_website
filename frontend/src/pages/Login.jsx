import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BiShieldQuarter, BiEnvelope, BiLock, BiUserCircle, BiPhone, BiBookOpen, BiStar, BiCalendar } from 'react-icons/bi'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Login(){
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Sign Up Specific States
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('Computer Science')
  const [semester, setSemester] = useState(1)
  const [gpa, setGpa] = useState(0.0)

  const navigate = useNavigate()

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        // Sign-up workflow
        if (!email.trim() || !password.trim() || !name.trim()) {
          toast.error('Please fill in all required fields')
          setLoading(false)
          return
        }
        await authService.register(email, password, 'Student', name, phone, department, semester, gpa)
        toast.success('Student account created successfully!')
      } else {
        // Sign-in workflow
        try {
          await authService.login(email, password, role)
          toast.success('Welcome back!')
        } catch (err) {
          if (err.response?.status === 404 && err.response?.data?.message === 'NEW_STUDENT_DETECTED') {
            toast.success('New Gmail student account! Please fill in your profile details below to complete registration.', {
              duration: 6000
            })
            setIsSignUp(true)
            setLoading(false)
            return
          } else {
            throw err
          }
        }
      }
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Invalid credentials or failed sign-in.')
    } finally {
      setLoading(false)
    }
  }

  const departments = [
    'Artificial Intelligence & Machine Learning',
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Information Technology',
    'Civil Engineering',
    'Electrical Engineering',
    'Data Science'
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#251b4f] to-[#090e2b] text-white">
      <div className="absolute inset-0 bg-hero-gradient opacity-90" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute right-10 top-32 h-60 w-60 rounded-full bg-sky-400/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-between gap-8 px-6 py-12">
        <div className="max-w-lg space-y-6 hidden lg:block">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-sm text-white/80 shadow-xl backdrop-blur-sm">
            <BiShieldQuarter className="text-lg text-cyan-200" />
            Premium student dashboard for institutions
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold leading-tight text-white">A smarter way to manage students, courses and fees.</h1>
            <p className="max-w-xl text-lg text-slate-200/90">Modern analytics, attendance tracking, and communication in one beautiful admin experience.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-cyan-300"><BiEnvelope className="text-2xl" /><div className="text-sm text-slate-200/80">Real-time student insights</div></div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-violet-300"><BiUserCircle className="text-2xl" /><div className="text-sm text-slate-200/80">Effortless profile management</div></div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative w-full max-w-lg mx-auto rounded-[30px] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/70">{isSignUp ? 'Sign Up' : 'Sign in'}</p>
              <h2 className="text-3xl font-semibold text-white">{isSignUp ? 'Create Student Profile' : 'Welcome back'}</h2>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-sky-400 px-4 py-2 text-sm font-semibold text-white">
              {isSignUp ? 'Student' : role}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp ? (
              // ================= STUDENT SIGN UP FIELDS =================
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiUserCircle className="text-slate-400" />
                      <input 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        className="w-full border-none bg-transparent text-white outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Phone Number</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiPhone className="text-slate-400" />
                      <input 
                        required 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full border-none bg-transparent text-white outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Email Address</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiEnvelope className="text-slate-400" />
                      <input 
                        type="email"
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full border-none bg-transparent text-white outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Department</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiBookOpen className="text-slate-400" />
                      <select 
                        value={department} 
                        onChange={e=>setDepartment(e.target.value)} 
                        className="w-full border-none bg-transparent text-white outline-none [&>option]:text-slate-900"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Current Semester</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiCalendar className="text-slate-400" />
                      <input 
                        type="number"
                        min="1"
                        max="8"
                        required 
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                        className="w-full border-none bg-transparent text-white outline-none" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">GPA (Out of 4.0)</label>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                      <BiStar className="text-slate-400" />
                      <input 
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        required 
                        value={gpa}
                        onChange={e => setGpa(e.target.value)}
                        className="w-full border-none bg-transparent text-white outline-none" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Select Password</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
                    <BiLock className="text-slate-400" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border-none bg-transparent text-white outline-none" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              // ================= STANDARD SIGN IN FIELDS =================
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-200/80 mb-2">Email or Username</label>
                  <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3">
                    <BiEnvelope className="text-slate-400" />
                    <input 
                      required 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border-none bg-transparent text-white outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-200/80 mb-2">Password</label>
                  <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3">
                    <BiLock className="text-slate-400" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full border-none bg-transparent text-white outline-none" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">Role
                    <select value={role} onChange={e=>setRole(e.target.value)} className="bg-transparent text-white outline-none [&>option]:text-slate-900">
                      <option>Admin</option>
                      <option>Student</option>
                    </select>
                  </div>
                  <button type="button" className="text-slate-200/80 underline hover:text-white">Forgot password?</button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-6 py-3 text-base font-semibold text-white shadow-xl shadow-purple-500/20 transition hover:-translate-y-0.5 disabled:opacity-50 mt-4"
            >
              {loading ? (isSignUp ? 'Registering...' : 'Signing In...') : (isSignUp ? 'Create Student Account' : 'Sign In')}
            </button>
          </form>

          {/* ================= TOGGLE SIGN IN / SIGN UP MODE ================= */}
          <div className="mt-6 text-center text-sm text-slate-300 border-t border-white/5 pt-4">
            {isSignUp ? (
              <p>
                Already registered?{' '}
                <button 
                  onClick={() => {
                    setIsSignUp(false)
                    // Reset form
                    setEmail('')
                    setPassword('')
                  }} 
                  className="text-cyan-300 hover:text-cyan-200 font-semibold underline ml-1"
                >
                  Sign In here
                </button>
              </p>
            ) : (
              <p>
                New student?{' '}
                <button 
                  onClick={() => {
                    setIsSignUp(true)
                    // Reset form
                    setEmail('')
                    setPassword('')
                  }} 
                  className="text-cyan-300 hover:text-cyan-200 font-semibold underline ml-1"
                >
                  Register Student Account
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
