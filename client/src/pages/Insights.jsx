import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInsights,
  fetchPrediction
} from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'

function Insights() {
  const dispatch = useDispatch()

  const {
    insights,
    predictions,
    provider,
    loading,
    error
  } = useSelector((state) => state.insights)

  // Load insights and prediction when page opens
  useEffect(() => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }, [dispatch])

  // Refresh button
  const refresh = () => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }

  const confidence = Number(
    predictions?.confidence || 0
  )

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Insights
          </h1>

          <p className="mt-1 text-slate-600">
            AI-powered analysis of your spending and financial habits.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Recommendations */}
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recommendations
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {provider || 'heuristic'}
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <p className="text-slate-500">
              Generating insights...
            </p>
          ) : insights?.length > 0 ? (

            /* Insights List */
            <div className="space-y-4">

              {insights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >

                  <h3 className="font-semibold text-slate-900">
                    Insight {index + 1}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item}
                  </p>

                </div>
              ))}

            </div>

          ) : (

            /* No Insights */
            <p className="text-slate-500">
              Add transactions to generate insights.
            </p>

          )}

        </section>

        {/* Spending Prediction */}
        <section className="rounded-lg border bg-white p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Spending Prediction
          </h2>

          <div className="mt-5 space-y-5">

            {/* Predicted Expense */}
            <div>
              <p className="text-sm text-slate-500">
                Predicted Expense
              </p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {formatCurrency(
                  predictions?.predictedExpense || 0
                )}
              </p>
            </div>

            {/* Confidence */}
            <div>

              <div className="mb-2 flex justify-between text-sm">

                <span className="text-slate-500">
                  Confidence
                </span>

                <span className="font-medium">
                  {confidence.toFixed(0)}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      Math.max(confidence, 0),
                      100
                    )}%`
                  }}
                />

              </div>

            </div>

            {/* Budget Risk */}
            {predictions?.budgetRisk && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                ⚠️ Predicted spending is above your monthly budget.
              </div>
            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default Insights