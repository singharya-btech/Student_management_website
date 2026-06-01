import { FiActivity, FiUsers, FiBookOpen, FiCalendar, FiDollarSign, FiUser, FiSettings, FiLogOut, FiClipboard } from 'react-icons/fi'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../services/authService'

const items = [
  {to: '/', label: 'Dashboard', icon: <FiActivity />},
  {to: '/students', label: 'Students', icon: <FiUsers />},
  {to: '/courses', label: 'Courses', icon: <FiBookOpen />},
  {to: '/attendance', label: 'Attendance', icon: <FiCalendar />},
  {to: '/notices', label: 'Notice Board', icon: <FiClipboard />},
  {to: '/fees', label: 'Fees', icon: <FiDollarSign />},
  {to: '/profile', label: 'Profile', icon: <FiUser />},
  {to: '/settings', label: 'Settings', icon: <FiSettings />}
]

export default function Sidebar(){
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-10 hidden h-full w-72 flex-col border-r border-purple-500/20 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 px-6 py-8 text-slate-200 shadow-2xl shadow-purple-950/20 backdrop-blur-xl md:flex">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">StudentPro</div>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400/80">Powered by<br/>Sure Trust Learning Initiative</p>
      </motion.div>
      <nav className="flex flex-col gap-2">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({isActive})=> `group relative flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition duration-300 ${isActive ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-transparent text-white shadow-lg shadow-purple-500/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
          >
            {({isActive}) => (
              <>
                <span className={`text-lg transition duration-300 ${isActive ? 'text-purple-400' : 'group-hover:text-cyan-400'}`}>{item.icon}</span>
                <span className="relative">
                  {item.label}
                  {isActive && <div className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />}
                </span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="group relative mt-2 flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="text-lg transition duration-300 group-hover:text-red-400"><FiLogOut /></span>
          <span className="relative">Logout</span>
        </button>
      </nav>
      <div className="mt-auto rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-4 text-sm text-slate-300 shadow-inner shadow-purple-500/10">
        <div className="font-semibold text-white">Need Assistance?</div>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">Reach out to support or check the knowledge base for system help.</p>
        <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-xs font-semibold text-white transition hover:shadow-lg hover:shadow-purple-500/30">Support</button>
      </div>
    </aside>
  )
}
