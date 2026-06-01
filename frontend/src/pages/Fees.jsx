import React, { useEffect, useState } from 'react'
import { BiWallet, BiCreditCard, BiTimer, BiCheckCircle } from 'react-icons/bi'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { paymentService } from '../services/paymentService'
import { studentService } from '../services/studentService'
import { authService } from '../services/authService'
import { toast } from 'react-hot-toast'

export default function Fees(){
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({ totalCollected: '₹0k', totalPaid: '₹0k', dueBalance: '₹0k' })
  const [loading, setLoading] = useState(true)
  const currentUser = authService.getCurrentUser()
  const isAdmin = currentUser && currentUser.role === 'Admin'
  const [openAddModal, setOpenAddModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [totalAmount, setTotalAmount] = useState('10000')
  const [amount, setAmount] = useState('')
  const [studentsList, setStudentsList] = useState([])

  const fetchPayments = async () => {
    try {
      const data = await paymentService.getAllPayments()
      
      if (isAdmin) {
        // Admin View: show system totals and all student payments
        setPayments(data.payments)
        setStats(data.stats)

        // Fetch registered students to populate dropdown selection
        const allStudents = await studentService.getAllStudents()
        setStudentsList(allStudents)
        if (allStudents.length > 0 && !name) {
          setName(allStudents[0].name)
        }
      } else {
        // Student View: fetch personal student profile to compute personal fees
        const allStudents = await studentService.getAllStudents()
        const matchedStudent = allStudents.find(s => s.email.toLowerCase() === currentUser?.email?.toLowerCase())
        
        // Filter transactions to only show this student's billing statements
        const studentName = matchedStudent ? matchedStudent.name : ''
        const studentPayments = data.payments.filter(p => p.name.toLowerCase() === studentName.toLowerCase())
        setPayments(studentPayments)

        // Calculate personal balances based on Student record fees status
        const termFee = 10000
        let paid = 0
        let balance = 0

        if (matchedStudent) {
          if (matchedStudent.fees_status === 'Paid') {
            paid = termFee
            balance = 0
          } else if (matchedStudent.fees_status === 'Pending') {
            paid = termFee * 0.5
            balance = termFee * 0.5
          } else {
            paid = 0
            balance = termFee
          }
        }

        setStats({
          totalCollected: `₹${termFee.toLocaleString()}`,
          totalPaid: `₹${paid.toLocaleString()}`,
          dueBalance: `₹${balance.toLocaleString()}`
        })
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const paidAmt = Number(amount) || 0
    const totalAmt = Number(totalAmount) || 0
    const remBal = Math.max(0, totalAmt - paidAmt)

    let calculatedStatus = 'Pending'
    if (remBal === 0) calculatedStatus = 'Paid'
    else if (paidAmt === 0) calculatedStatus = 'Unpaid'

    try {
      await paymentService.recordPayment({
        name,
        totalAmount: totalAmt,
        amount: paidAmt,
        remainingBalance: remBal,
        status: calculatedStatus,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      })
      toast.success('Payment recorded successfully!')
      setOpenAddModal(false)
      // Reset form
      setAmount('')
      setTotalAmount('10000')
      if (studentsList.length > 0) {
        setName(studentsList[0].name)
      }
      // Refresh list
      fetchPayments()
    } catch (err) {
      console.error(err)
      toast.error('Failed to log payment transaction')
    } finally {
      setSubmitting(false)
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
              <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent dark:text-white">
                {isAdmin ? 'Fees & Payments' : 'My Financial Ledger'}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {isAdmin 
                  ? 'Monitor paid, due, and overdue fees with premium reporting cards.'
                  : 'Track your invoices, billing totals, paid balances, and receipts.'}
              </p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setOpenAddModal(true)}
                className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-primaryStart to-primaryEnd px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primaryStart/20 transition hover:-translate-y-0.5"
              >
                <BiCreditCard /> Record Payment
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="grid gap-6 xl:grid-cols-3">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-indigo-500/10 p-3 text-indigo-400"><BiWallet className="text-2xl" /></div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{isAdmin ? 'Total Collected' : 'Total Course Fee'}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.totalCollected}</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-400"><BiCheckCircle className="text-2xl" /></div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{isAdmin ? 'Total Paid' : 'Amount Paid'}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.totalPaid}</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-amber-500/10 p-3 text-amber-400"><BiTimer className="text-2xl" /></div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{isAdmin ? 'Due Balance' : 'Remaining Balance Due'}</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{stats.dueBalance}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="mt-6 p-6">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                  {isAdmin ? 'Recent Payments' : 'My Payment History'}
                </h2>
                <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/20">
                  <table className="min-w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400">
                      <tr>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Total Fee</th>
                        <th className="px-5 py-4">Amount Paid</th>
                        <th className="px-5 py-4">Balance Due</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {payments.map(payment => (
                        <tr key={payment._id || payment.id} className="hover:bg-white/5 transition">
                          <td className="px-5 py-4 text-white font-medium">{payment.name}</td>
                          <td className="px-5 py-4">${(payment.totalAmount !== undefined ? payment.totalAmount : 10000).toLocaleString()}</td>
                          <td className="px-5 py-4 text-emerald-400 font-semibold">${payment.amount.toLocaleString()}</td>
                          <td className="px-5 py-4 text-amber-400 font-semibold">${(payment.remainingBalance !== undefined ? payment.remainingBalance : 0).toLocaleString()}</td>
                          <td className="px-5 py-4">
                            {isAdmin ? (
                              <select
                                value={payment.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  let newBal = payment.remainingBalance;
                                  if (newStatus === 'Paid') {
                                    newBal = 0;
                                  } else if (newStatus === 'Unpaid') {
                                    newBal = payment.totalAmount || 10000;
                                  } else {
                                    newBal = (payment.totalAmount || 10000) * 0.5; // pending half-split default
                                  }
                                  
                                  try {
                                    await paymentService.updatePaymentStatus(payment._id || payment.id, newStatus, { remainingBalance: newBal });
                                    toast.success('Fee status updated successfully!');
                                    fetchPayments(); // refresh stats & list!
                                  } catch (err) {
                                    console.error(err);
                                    toast.error('Failed to update status');
                                  }
                                }}
                                className={`rounded-full px-3 py-1 text-xs font-semibold bg-slate-900 border border-white/10 outline-none cursor-pointer ${
                                  payment.status === 'Paid' 
                                    ? 'text-emerald-300' 
                                    : payment.status === 'Unpaid' 
                                      ? 'text-red-300' 
                                      : 'text-amber-300'
                                }`}
                              >
                                <option value="Paid" className="text-emerald-300 bg-slate-900">Paid</option>
                                <option value="Pending" className="text-amber-300 bg-slate-900">Pending</option>
                                <option value="Unpaid" className="text-red-300 bg-slate-900">Unpaid</option>
                              </select>
                            ) : (
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-300' : payment.status === 'Unpaid' ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'}`}>{payment.status}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-slate-400">{payment.date}</td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-slate-400">No payment logs found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </>
          )}
        </main>
      </div>

      <Modal open={openAddModal} title="Record Fee Payment" onClose={() => setOpenAddModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 dark:text-white">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Select Student</label>
            <select
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none text-slate-900 dark:text-white"
            >
              {studentsList.map(s => (
                <option key={s.id || s._id} value={s.name}>{s.name} ({s.id})</option>
              ))}
              {studentsList.length === 0 && (
                <option value="">No students available</option>
              )}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Fee Amount ($)</label>
              <input 
                type="number" 
                min="0"
                required 
                value={totalAmount} 
                onChange={e => setTotalAmount(e.target.value)} 
                placeholder="10000" 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none text-slate-900 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Amount Paid ($)</label>
              <input 
                type="number" 
                min="0" 
                required 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="5000" 
                className="w-full rounded-xl border border-slate-300 dark:border-purple-500/20 bg-white dark:bg-slate-950 px-4 py-2 outline-none text-slate-900 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Remaining Balance ($)</label>
              <input 
                type="number" 
                disabled
                value={Math.max(0, (Number(totalAmount) || 0) - (Number(amount) || 0))} 
                className="w-full rounded-xl border border-slate-200 dark:border-purple-500/10 bg-slate-100 dark:bg-slate-900/60 px-4 py-2 outline-none text-slate-500 cursor-not-allowed font-semibold" 
              />
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400">Calculated Status: </span>
            <span className={`font-semibold ${
              Math.max(0, (Number(totalAmount) || 0) - (Number(amount) || 0)) <= 0 
                ? 'text-emerald-400' 
                : (Number(amount) || 0) === 0 
                  ? 'text-red-400' 
                  : 'text-amber-400'
            }`}>
              {Math.max(0, (Number(totalAmount) || 0) - (Number(amount) || 0)) <= 0 
                ? 'Paid' 
                : (Number(amount) || 0) === 0 
                  ? 'Unpaid' 
                  : 'Pending'}
            </span>
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
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  )
}
