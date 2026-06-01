import { motion } from 'framer-motion'

export default function StatCard({icon, label, value, change, className = ''}){
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/70 to-white/20 p-5 shadow-glow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-200">{change}</span>
      </div>
      <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{label}</p>
    </motion.div>
  )
}
