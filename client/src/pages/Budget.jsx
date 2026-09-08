import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'

function Budget() {
  const dispatch = useDispatch()

  const budget = useSelector((state) => state.budget)

  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchBudget())

    const loadSummary = async () => {
      try {
        const response = await getDashboardSummary()
        setSummary(response.data.data)
      } catch (error) {
        console.error('Failed to load dashboard summary:', error)
      }
    }

    loadSummary()
  }, [dispatch])

  useEffect(() => {
    setMonthlyBudget(budget.monthlyBudget || 0)
    setCategoryBudgets(budget.categories || [])
  }, [budget.monthlyBudget, budget.categories])

  const addCategory = () => {
    setCategoryBudgets([
      ...categoryBudgets,
      {
        category: 'Food',
        limit: 0
      }
    ])
  }

  const updateCategory = (index, field, value) => {
    const updated = [...categoryBudgets]

    updated[index] = {
      ...updated[index],
      [field]: field === 'limit' ? Number(value) : value
    }

    setCategoryBudgets(updated)
  }

  const removeCategory = (index) => {
    setCategoryBudgets(
      categoryBudgets.filter((_, i) => i !== index)
    )
  }

  const save = async (event) => {
    event.preventDefault()

    setMessage('')

    try {
      await dispatch(
        saveBudget({
          monthlyBudget: Number(monthlyBudget),
          categoryBudgets
        })
      ).unwrap()

      setMessage('Budget saved successfully!')

      const response = await getDashboardSummary()
      setSummary(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const totalExpense = summary?.totalExpense || 0

  const remaining =
    Number(monthlyBudget) - Number(totalExpense)

  const usedPercent =
    monthlyBudget > 0
      ? Math.min(
          (totalExpense / monthlyBudget) * 100,
          100
        )
      : 0

  const getCategorySpent = (category) => {
    const item = summary?.categoryBreakdown?.find(
      (item) => item.category === category
    )

    return item?.amount || 0
  }

  return (
    <div className="space-y-6">

      {/* Heading */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Budget
        </h1>

        <p className="mt-1 text-slate-600">
          Set your monthly and category spending limits.
        </p>
      </div>

      {/* Success message */}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      {/* Error */}

      {budget.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {budget.error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* Budget form */}

        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">

          <form onSubmit={save} className="space-y-5">

            {/* Monthly budget */}

            <div>
              <label className="mb-2 block font-medium">
                Monthly Budget
              </label>

              <input
                type="number"
                min="0"
                value={monthlyBudget}
                onChange={(e) =>
                  setMonthlyBudget(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter monthly budget"
                required
              />
            </div>

            {/* Category budgets */}

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Category Budgets
              </h2>

              <button
                type="button"
                onClick={addCategory}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                + Add Category
              </button>

            </div>

            {/* Categories */}

            <div className="space-y-4">

              {categoryBudgets.length === 0 && (
                <p className="text-sm text-slate-500">
                  No category budgets added yet.
                </p>
              )}

              {categoryBudgets.map((item, index) => {

                const spent = getCategorySpent(
                  item.category
                )

                const limit = Number(item.limit || 0)

                const percent =
                  limit > 0
                    ? Math.min(
                        (spent / limit) * 100,
                        100
                      )
                    : 0

                return (
                  <div
                    key={index}
                    className="rounded-lg border p-4"
                  >

                    <div className="grid gap-3 md:grid-cols-3">

                      {/* Category */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Category
                        </label>

                        <select
                          value={item.category}
                          onChange={(e) =>
                            updateCategory(
                              index,
                              'category',
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                        >
                          {categories.map((category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Limit */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Limit
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={item.limit}
                          onChange={(e) =>
                            updateCategory(
                              index,
                              'limit',
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border px-3 py-2"
                        />
                      </div>

                      {/* Remove */}

                      <div className="flex items-end">

                        <button
                          type="button"
                          onClick={() =>
                            removeCategory(index)
                          }
                          className="rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                    {/* Progress */}

                    <div className="mt-4">

                      <div className="mb-1 flex justify-between text-sm">

                        <span>
                          Spent: {formatCurrency(spent)}
                        </span>

                        <span>
                          Limit: {formatCurrency(limit)}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className={`h-full ${
                            percent >= 100
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${percent}%`
                          }}
                        />

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

            {/* Save */}

            <button
              type="submit"
              disabled={budget.loading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {budget.loading
                ? 'Saving...'
                : 'Save Budget'}
            </button>

          </form>

        </section>

        {/* Monthly progress */}

        <section className="rounded-lg border bg-white p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Monthly Progress
          </h2>

          <div className="mt-5 space-y-5">

            {/* Budget */}

            <div>
              <p className="text-sm text-slate-500">
                Monthly Budget
              </p>

              <p className="text-2xl font-bold">
                {formatCurrency(monthlyBudget)}
              </p>
            </div>

            {/* Spent */}

            <div>
              <p className="text-sm text-slate-500">
                Spent
              </p>

              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpense)}
              </p>
            </div>

            {/* Remaining */}

            <div>
              <p className="text-sm text-slate-500">
                Remaining
              </p>

              <p
                className={`text-2xl font-bold ${
                  remaining < 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {formatCurrency(remaining)}
              </p>
            </div>

            {/* Progress */}

            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span>Budget Used</span>

                <span>
                  {usedPercent.toFixed(0)}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                <div
                  className={`h-full ${
                    usedPercent >= 100
                      ? 'bg-red-500'
                      : 'bg-sky-500'
                  }`}
                  style={{
                    width: `${usedPercent}%`
                  }}
                />

              </div>

            </div>

            {/* Alert */}

            {remaining < 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                ⚠️ You have exceeded your monthly budget.
              </div>
            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Budget