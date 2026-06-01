import React, { useEffect, useState } from 'react'
import { BiPlusCircle, BiUser, BiEdit, BiTrash } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { courseService } from '../services/courseService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Courses(){
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser && currentUser.role === 'Admin'
  
  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false)
  
  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  
  // Assign Modal State
  const [openAssignModal, setOpenAssignModal] = useState(false)
  const [assigningCourse, setAssigningCourse] = useState(null)
  const [assignedFaculty, setAssignedFaculty] = useState('')

  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [faculty, setFaculty] = useState('')
  const [seats, setSeats] = useState(30)
  const [status, setStatus] = useState('Open')

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses()
      setCourses(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load course catalog')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await courseService.createCourse({
        title,
        faculty,
        seats: Number(seats),
        status
      })
      toast.success('Course created successfully!')
      setOpenAddModal(false)
      // Reset form
      setTitle('')
      setFaculty('')
      setSeats(30)
      setStatus('Open')
      fetchCourses()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add new course')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClick = (course) => {
    setEditingCourse(course)
    setTitle(course.title)
    setFaculty(course.faculty)
    setSeats(course.seats)
    setStatus(course.status)
    setOpenEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await courseService.updateCourse(editingCourse.id, {
        title,
        faculty,
        seats: Number(seats),
        status
      })
      toast.success('Course updated successfully!')
      setOpenEditModal(false)
      fetchCourses()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update course')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignClick = (course) => {
    setAssigningCourse(course)
    setAssignedFaculty(course.faculty)
    setOpenAssignModal(true)
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await courseService.updateCourse(assigningCourse.id, {
        faculty: assignedFaculty
      })
      toast.success('Faculty instructor assigned successfully!')
      setOpenAssignModal(false)
      fetchCourses()
    } catch (err) {
      console.error(err)
      toast.error('Failed to assign instructor')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete ${courseTitle}?`)) {
      try {
        await courseService.deleteCourse(courseId)
        toast.success('Course deleted successfully')
        fetchCourses()
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete course')
      }
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Course Catalog</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Manage course offerings, faculty assignments, and capacity at a glance.</p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => {
                  // Reset form to defaults
                  setTitle('')
                  setFaculty('')
                  setSeats(30)
                  setStatus('Open')
                  setOpenAddModal(true)
                }}
                className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primaryStart/20 transition hover:-translate-y-0.5"
              >
                <BiPlusCircle /> Add Course
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {courses.map(course => (
                <div key={course.id} className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-primaryStart/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{course.id}</p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">{course.title}</h2>
                      <p className="mt-2 text-sm text-slate-400">Instructor: <span className="text-slate-100">{course.faculty}</span></p>
                    </div>
                    <span className="rounded-3xl bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{course.status}</span>
                  </div>
                  <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                    <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-slate-300">Seats {course.seats}</div>
                    {isAdmin && (
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleAssignClick(course)}
                          className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
                        >
                          <BiUser /> Assign
                        </button>
                        <button 
                          onClick={() => handleEditClick(course)}
                          className="inline-flex items-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/15"
                        >
                          <BiEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id, course.title)}
                          className="inline-flex items-center gap-2 rounded-3xl bg-red-500/20 px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/30"
                        >
                          <BiTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="col-span-2 text-center py-10 text-slate-400">No courses listed in catalog.</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Course Modal */}
      <Modal open={openAddModal} title="Add New Course" onClose={() => setOpenAddModal(false)}>
        <form onSubmit={handleAddSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Course Title</label>
            <input 
              required 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="Data Mining & Analytics" 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Faculty Instructor</label>
            <input 
              required 
              value={faculty} 
              onChange={e=>setFaculty(e.target.value)} 
              placeholder="Dr. Christopher" 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Maximum Seats</label>
              <input 
                type="number" 
                min="5" 
                max="100" 
                required 
                value={seats} 
                onChange={e=>setSeats(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Enrollment Status</label>
              <select 
                value={status} 
                onChange={e=>setStatus(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none"
              >
                <option value="Open">Open</option>
                <option value="Almost full">Almost full</option>
                <option value="New">New</option>
              </select>
            </div>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primaryStart to-primaryEnd text-white font-semibold shadow-lg shadow-primaryStart/20 hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={openEditModal} title="Edit Course Details" onClose={() => setOpenEditModal(false)}>
        <form onSubmit={handleEditSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Course Title</label>
            <input 
              required 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Faculty Instructor</label>
            <input 
              required 
              value={faculty} 
              onChange={e=>setFaculty(e.target.value)} 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Maximum Seats</label>
              <input 
                type="number" 
                min="5" 
                max="100" 
                required 
                value={seats} 
                onChange={e=>setSeats(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Enrollment Status</label>
              <select 
                value={status} 
                onChange={e=>setStatus(e.target.value)} 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none"
              >
                <option value="Open">Open</option>
                <option value="Almost full">Almost full</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setOpenEditModal(false)} 
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primaryStart to-primaryEnd text-white font-semibold shadow-lg shadow-primaryStart/20 hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Instructor Modal */}
      <Modal open={openAssignModal} title="Assign Faculty Instructor" onClose={() => setOpenAssignModal(false)}>
        <form onSubmit={handleAssignSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <p className="text-sm text-slate-500 mb-3">Re-assign a faculty instructor for **{assigningCourse?.title}**.</p>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Instructor Name</label>
            <input 
              required 
              value={assignedFaculty} 
              onChange={e=>setAssignedFaculty(e.target.value)} 
              placeholder="e.g. Prof. Alan Turing" 
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none" 
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => setOpenAssignModal(false)} 
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-primaryStart to-primaryEnd text-white font-semibold shadow-lg shadow-primaryStart/20 hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Assigning...' : 'Assign Instructor'}
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  )
}
