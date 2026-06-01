import React, { useEffect, useState } from 'react'
import { BiPlusCircle, BiFilter } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StudentTable from '../components/StudentTable'
import PageTransition from '../components/PageTransition'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { studentService } from '../services/studentService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Students(){
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('Computer Science')
  const [semester, setSemester] = useState(1)
  const [gpa, setGpa] = useState(0.0)
  const [attendance, setAttendance] = useState(100)
  const [feesStatus, setFeesStatus] = useState('Pending')

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAllStudents()
      setStudents(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load students list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await studentService.createStudent({
        name,
        email,
        phone,
        department,
        semester: Number(semester),
        gpa: Number(gpa),
        attendance: Number(attendance),
        fees_status: feesStatus
      })
      toast.success('Student added successfully! They can log in with their email and password: student123', {
        duration: 6000
      })
      setOpenAddModal(false)
      // Reset form
      setName('')
      setEmail('')
      setPhone('')
      setSemester(1)
      setGpa(0.0)
      setAttendance(100)
      setFeesStatus('Pending')
      // Refresh list
      fetchStudents()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to add student')
    } finally {
      setSubmitting(false)
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

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser && currentUser.role === 'Admin'

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent dark:text-white">Student Management</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Search, filter, and manage student profiles with real-time actions.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5">
                <BiFilter /> Filter
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setOpenAddModal(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5"
                >
                  <BiPlusCircle /> Add Student
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <StudentTable data={students} onRefresh={fetchStudents} />
          )}
        </main>
      </div>

      <Modal open={openAddModal} title="Add New Student" onClose={() => setOpenAddModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
              <input 
                required 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                placeholder="John Doe" 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="john@university.edu" 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
              <input 
                required 
                value={phone} 
                onChange={e=>setPhone(e.target.value)} 
                placeholder="+91 98765 43210" 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Department</label>
              <select 
                value={department} 
                onChange={e=>setDepartment(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Semester</label>
              <input 
                type="number" 
                min="1" 
                max="8" 
                required 
                value={semester} 
                onChange={e=>setSemester(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">GPA</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="4" 
                required 
                value={gpa} 
                onChange={e=>setGpa(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Attendance %</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                required 
                value={attendance} 
                onChange={e=>setAttendance(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Fees Status</label>
            <select 
              value={feesStatus} 
              onChange={e=>setFeesStatus(e.target.value)} 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setOpenAddModal(false)} 
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  )
}
