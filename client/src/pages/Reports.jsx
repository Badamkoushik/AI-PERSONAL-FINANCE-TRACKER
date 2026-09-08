import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  downloadMonthlyReport,
  getMonthlyReport
} from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'

function Reports() {
  const today = new Date()

  const [period, setPeriod] = useState({
    month: today.getMonth() + 1,
    year: today.getFullYear()
  })

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(
    () => ({
      month: period.month,
      year: period.year
    }),
    [period.month, period.year]
  )

  // Load monthly report
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getMonthlyReport(params)
        setReport(response.data.data)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load report'
        )
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [params])

  // Export PDF
  const exportPdf = async () => {
    try {
      const response = await downloadMonthlyReport(params)

      const blob = new Blob([response.data], {
        type: 'application/pdf'
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `finance-report-${period.year}-${String(
        period.month
      ).padStart(2, '0')}.pdf`

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to export PDF'
      )
    }
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const income = Number(report?.totalIncome || 0)
  const expense = Number(report?.totalExpense || 0)
  const savings = Number(report?.savings || 0)
  const remaining = Number(
    report?.budgetRemaining ?? 0
  )

  const categoryData =
    report?.categoryBreakdown || []

  const transactions =
    report?.transactions || []

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-1 text-slate-600">
            View your monthly financial report and export it as a PDF.
          </p>
        </div>

        <button
          onClick={exportPdf}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Export PDF
        </button>

      </div>

      {/* Period */}

      <section className="rounded-lg border bg-white p-4 shadow-sm">

        <div className="grid gap-3 md:grid-cols-3">

          {/* Month */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Month
            </label>

            <select
              value={period.month}
              onChange={(e) =>
                setPeriod({
                  ...period,
                  month: Number(e.target.value)
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {months.map((month, index) => (
                <option
                  key={month}
                  value={index + 1}
                >
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Year
            </label>

            <input
              type="number"
              value={period.year}
              min="2000"
              max="2100"
              onChange={(e) =>
                setPeriod({
                  ...period,
                  year: Number(e.target.value)
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

        </div>

      </section>

      {/* Loading */}

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-slate-500 shadow-sm">
          Loading report...
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Report */}

      {report && !loading && (

        <>

          {/* Summary Cards */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Income
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {formatCurrency(income)}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Expense
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {formatCurrency(expense)}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Savings
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {formatCurrency(savings)}
              </p>
            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Remaining
              </p>

              <p
                className={`mt-2 text-2xl font-bold ${
                  remaining < 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {formatCurrency(remaining)}
              </p>
            </div>

          </div>

          {/* Charts + Transactions */}

          <div className="grid gap-6 xl:grid-cols-3">

            {/* Category Analytics */}

            <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">

              <h2 className="text-xl font-semibold">
                Category Analytics
              </h2>

              <div className="mt-4 h-72">

                {categoryData.length > 0 ? (

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart data={categoryData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                      />

                      <YAxis />

                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(value)
                        }
                      />

                      <Bar
                        dataKey="amount"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      />

                    </BarChart>
                  </ResponsiveContainer>

                ) : (

                  <div className="flex h-full items-center justify-center text-slate-500">
                    No category data for this period.
                  </div>

                )}

              </div>

            </section>

            {/* Transactions */}

            <section className="rounded-lg border bg-white p-5 shadow-sm">

              <h2 className="text-xl font-semibold">
                Transactions
              </h2>

              <div className="mt-4 max-h-72 space-y-3 overflow-auto">

                {transactions.length > 0 ? (

                  transactions.map((transaction) => {

                    const isIncome =
                      transaction.type === 'income'

                    return (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between border-b pb-3 last:border-b-0"
                      >

                        <div className="min-w-0">

                          <p className="truncate font-medium">
                            {transaction.title}
                          </p>

                          <p className="text-xs text-slate-500">
                            {transaction.category}
                            {' • '}
                            {formatDate(
                              transaction.transactionDate
                            )}
                          </p>

                        </div>

                        <p
                          className={`ml-3 whitespace-nowrap font-semibold ${
                            isIncome
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </p>

                      </div>
                    )
                  })

                ) : (

                  <p className="text-slate-500">
                    No transactions for this period.
                  </p>

                )}

              </div>

            </section>

          </div>

        </>

      )}

    </div>
  )
}

export default Reports