import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency } from '../utils/format'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then((response) => {
        console.log('SUMMARY RESPONSE:', response.data)
        setSummary(response.data.data)
      })
      .catch((err) => {
        console.error('SUMMARY ERROR:', err)
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load dashboard'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <h2>Loading dashboard...</h2>
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-100 p-5 text-red-700">
        Dashboard Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        AI Finance Tracker Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p>Total Income</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary?.totalIncome)}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p>Total Expense</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary?.totalExpense)}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p>Remaining Budget</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary?.budgetRemaining)}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <p>Savings</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(summary?.savings)}
          </p>
        </div>

      </div>

    </div>
  )
}

export default Dashboard