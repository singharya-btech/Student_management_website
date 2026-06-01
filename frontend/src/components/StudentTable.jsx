import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BiDownload, BiSearch, BiTrash } from 'react-icons/bi'
import { studentService } from '../services/studentService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function StudentTable({data, onRefresh, searchQuery, setSearchQuery}){
  const [deletingId, setDeletingId] = useState(null)
  const currentUser = authService ? authService.getCurrentUser() : null
  const isAdmin = currentUser && currentUser.role === 'Admin'
  const [localQ, setLocalQ] = useState('')
  const q = searchQuery !== undefined ? searchQuery : localQ
  const setQ = setSearchQuery !== undefined ? setSearchQuery : setLocalQ
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = useMemo(()=>{
    let out = data
    if(q) out = out.filter(s => `${s.name}${s.email}${s.department}${s.phone}`.toLowerCase().includes(q.toLowerCase()))
    if(filter !== 'All') out = out.filter(s=> s.department.includes(filter))
    return out
  },[data,q,filter])

  const pages = Math.max(1, Math.ceil(filtered.length/perPage))
  const slice = filtered.slice((page-1)*perPage, page*perPage)
  const departments = [...new Set(data.map(s=>s.department.split(' ')[0]))]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-slate-950/70 to-purple-950/20 p-4 shadow-lg shadow-purple-500/10 md:flex-row md:items-center md:justify-between backdrop-blur">
        <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-900/60 px-4 py-3 shadow-inner border border-purple-500/10">
          <BiSearch className="text-lg text-slate-400" />
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search students, email, department..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-2xl bg-slate-900/60 px-4 py-3 text-sm text-white outline-none shadow-inner border border-purple-500/10">
            <option>All</option>
            {departments.map(dept => <option key={dept}>{dept}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5">
            <BiDownload /> Export
          </button>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[24px] border border-purple-500/20 bg-gradient-to-br from-slate-950/80 to-purple-950/10 shadow-2xl shadow-purple-500/10 backdrop-blur">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-gradient-to-r from-slate-900/80 to-purple-900/30 text-slate-400">
            <tr>
              {['ID','Name','Email','Department','Attendance','Fees Status', isAdmin ? 'Actions' : ''].filter(Boolean).map(col=>(<th key={col} className="px-5 py-4 text-left font-semibold uppercase tracking-wide text-xs">{col}</th>))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {slice.map((student, index)=> (
              <motion.tr key={student.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="transition hover:bg-purple-500/5 hover:border-purple-500/20">
                <td className="px-5 py-4 text-slate-300 font-mono text-xs">{student.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white font-bold text-sm bg-gradient-to-br ${student.color}`}>{student.avatar}</div>
                    <span className="text-white font-medium">{student.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-400 text-xs">{student.email}</td>
                <td className="px-5 py-4 text-slate-300 text-xs">{student.department.split(' ')[0]}</td>
                <td className="px-5 py-4"><span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-300">{student.attendance}%</span></td>
                <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${student.fees_status === 'Paid' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{student.fees_status}</span></td>
                {isAdmin && (
                  <td className="px-5 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-300 transition hover:bg-purple-500/20">View</button>
                      <button 
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
                            setDeletingId(student.id)
                            try {
                              await studentService.deleteStudent(student.id)
                              toast.success('Student deleted successfully')
                              if (onRefresh) onRefresh()
                            } catch (err) {
                              console.error(err)
                              toast.error('Failed to delete student')
                            } finally {
                              setDeletingId(null)
                            }
                          }
                        }}
                        disabled={deletingId === student.id}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/20 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <BiTrash /> {deletingId === student.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-semibold text-slate-300">{filtered.length} students matched</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-2xl bg-gradient-to-r from-slate-900/60 to-purple-900/20 border border-purple-500/20 px-4 py-2 text-white transition hover:border-purple-500/40">Prev</button>
          <span className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 font-semibold">{page}/{pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} className="rounded-2xl bg-gradient-to-r from-slate-900/60 to-purple-900/20 border border-purple-500/20 px-4 py-2 text-white transition hover:border-purple-500/40">Next</button>
        </div>
      </div>
    </div>
  )
}
