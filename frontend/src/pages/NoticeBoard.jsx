import React, { useEffect, useState } from 'react'
import { FiPlusCircle, FiTrash2, FiBell, FiAward, FiCalendar, FiVolume2, FiSearch } from 'react-icons/fi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { noticeService } from '../services/noticeService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function NoticeBoard() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Announcement')

  // Search & Filtering State
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser && currentUser.role === 'Admin'

  const fetchNotices = async () => {
    setLoading(true)
    try {
      const data = await noticeService.getAllNotices()
      setNotices(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load notice board items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      return toast.error('Please fill in all required fields')
    }
    setSubmitting(true)
    try {
      await noticeService.createNotice({
        title,
        content,
        category
      })
      toast.success('Announcement posted successfully!')
      setOpenAddModal(false)
      // Reset form
      setTitle('')
      setContent('')
      setCategory('Announcement')
      // Refresh notices
      fetchNotices()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to post announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await noticeService.deleteNotice(id)
        toast.success('Announcement deleted successfully')
        fetchNotices()
      } catch (err) {
        console.error(err)
        toast.error('Failed to delete announcement')
      }
    }
  }

  // Categories helper to style badges
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Event':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          icon: <FiCalendar className="mr-1 text-sm inline-block" />,
          label: 'Event'
        }
      case 'Result':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
          icon: <FiAward className="mr-1 text-sm inline-block" />,
          label: 'Result'
        }
      case 'Announcement':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          icon: <FiVolume2 className="mr-1 text-sm inline-block" />,
          label: 'Announcement'
        }
    }
  }

  // Filter and search computation
  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Format date helper
  const formatDate = (dateString) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          {/* Header section */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent dark:text-white">
                Notice Board
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Stay updated with the latest events, results, and announcements from college administration.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setOpenAddModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5"
              >
                <FiPlusCircle className="text-lg" /> Post Notice
              </button>
            )}
          </div>

          {/* Filtering and Search controls */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['All', 'Announcement', 'Event', 'Result'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-2xl border transition ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-purple-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {cat === 'All' ? 'All Updates' : cat + 's'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-purple-500/10 px-4 py-2 shadow-inner w-full md:max-w-xs transition focus-within:border-purple-500/30">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs outline-none flex-1 placeholder:text-slate-400 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Main content display */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotices.map((notice) => {
                const styles = getCategoryStyles(notice.category)
                return (
                  <GlassCard
                    key={notice._id}
                    className="p-6 flex flex-col justify-between border border-white/10 shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/20 transition-all duration-300 group"
                  >
                    <div>
                      {/* Notice Header details */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center ${styles.bg}`}
                        >
                          {styles.icon}
                          {styles.label}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(notice._id)}
                            className="text-slate-400 hover:text-red-400 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete Notice"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        )}
                      </div>

                      {/* Notice Content */}
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                        {notice.title}
                      </h3>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed break-words line-clamp-5">
                        {notice.content}
                      </p>
                    </div>

                    {/* Notice Footer details */}
                    <div className="mt-6 pt-4 border-t border-slate-150 dark:border-purple-500/10 flex items-center justify-between text-xxs text-slate-400">
                      <span>Posted by <strong className="text-slate-600 dark:text-slate-300 font-semibold">{notice.postedBy}</strong></span>
                      <span className="font-mono text-slate-400">{formatDate(notice.date)}</span>
                    </div>
                  </GlassCard>
                )
              })}

              {filteredNotices.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4 animate-pulse">
                    <FiBell className="text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">No notices found</h3>
                  <p className="mt-2 text-sm text-slate-400 text-center max-w-sm">
                    {searchQuery
                      ? 'No updates matched your search query. Try typing something else.'
                      : 'There are currently no announcements posted on the notice board.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal form for posting announcements */}
      <Modal open={openAddModal} title="Post College Announcement" onClose={() => setOpenAddModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart India Hackathon Registration"
              className="w-full rounded-xl border border-slate-350 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-350 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none focus:border-purple-500/50"
            >
              <option value="Announcement">College Announcement</option>
              <option value="Event">Campus Event</option>
              <option value="Result">Result Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Notice Content
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter detailed notice information..."
              className="w-full rounded-xl border border-slate-350 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none focus:border-purple-500/50 resize-none leading-relaxed"
            />
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
              {submitting ? 'Posting...' : 'Post Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  )
}
