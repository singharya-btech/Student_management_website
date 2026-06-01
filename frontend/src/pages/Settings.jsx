import React from 'react'
import { BiMoon, BiBell, BiLock, BiLogOut } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'

export default function Settings({dark, setDark}){
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }
  return (
    <PageTransition>
      <div className="min-h-screen md:ml-64">
        <Sidebar />
        <Navbar />
        <main className="px-6 pb-10 pt-6 lg:px-10">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Settings</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Control the dashboard theme, security, and notification preferences.</p>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Appearance</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose the theme that suits your workspace.</p>
                </div>
                <button onClick={()=>setDark(!dark)} className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primaryStart/20">
                  <BiMoon /> {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Notifications</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manage alerts for updates and student activity.</p>
                <div className="mt-6 space-y-4">
                  {['Email alerts', 'SMS reminders', 'In-app notifications'].map((item, key)=>(
                    <div key={key} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4">
                      <div>
                        <p className="font-medium text-white">{item}</p>
                        <p className="text-sm text-slate-400">Enable or disable this delivery channel.</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="h-6 w-12 rounded-full bg-slate-700 peer-checked:bg-primaryStart"></div>
                        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
          <GlassCard className="mt-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Security</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Update your password and sign out from all sessions.</p>
              </div>
            </div>
            <form className="mt-6 grid gap-4">
              <input placeholder="Current password" type="password" className="rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-slate-100 outline-none" />
              <input placeholder="New password" type="password" className="rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-slate-100 outline-none" />
              <input placeholder="Confirm new password" type="password" className="rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-slate-100 outline-none" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button className="rounded-3xl bg-primaryStart px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primaryStart/20 transition hover:-translate-y-0.5">Save Changes</button>
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-3xl bg-red-500/20 px-6 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
                >
                  <BiLogOut /> Logout
                </button>
              </div>
            </form>
          </GlassCard>
        </main>
      </div>
    </PageTransition>
  )
}
