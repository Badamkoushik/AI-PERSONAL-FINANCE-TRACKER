import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'

import {
  categories,
  formatCurrency,
  formatDate,
  paymentMethods
} from '../utils/format'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

function Transactions() {
  const dispatch = useDispatch()

  const {
    transactions,
    loading,
    error
  } = useSelector((state) => state.transactions)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: 1,
        limit: 10
      })
    )
  }, [dispatch])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitForm = async (e) => {
    e.preventDefault()

    setMessage('')

    const result = await dispatch(
      saveTransaction({
        id: editingId,
        data: {
          ...form,
          amount: Number(form.amount)
        }
      })
    )

    if (saveTransaction.fulfilled.match(result)) {
      setMessage(
        editingId
          ? 'Transaction updated successfully.'
          : 'Transaction added successfully.'
      )

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)

      dispatch(
        fetchTransactions({
          page: 1,
          limit: 10
        })
      )
    }
  }

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction?'
    )

    if (!confirmed) return

    const result = await dispatch(
      removeTransactionById(id)
    )

    if (removeTransactionById.fulfilled.match(result)) {
      setMessage('Transaction deleted successfully.')
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Transactions
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your income and expenses.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          + Add Transaction
        </button>

      </div>

      {/* Messages */}

      {message && (
        <div className="rounded-lg bg-green-100 p-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Transaction table */}

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center"
                  >
                    Loading transactions...
                  </td>
                </tr>
              )}

              {!loading && transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No transactions yet.
                  </td>
                </tr>
              )}

              {!loading &&
                transactions.map((item) => (
                  <tr key={item._id}>

                    <td className="px-4 py-3 font-medium">
                      {item.title}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {item.type}
                    </td>

                    <td className="px-4 py-3">
                      {item.category}
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(item.transactionDate)}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="px-4 py-3">

                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* Add Transaction Modal */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Add Transaction
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-500"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={submitForm}
              className="space-y-4"
            >

              {/* Type */}

              <div>
                <label className="mb-1 block font-medium">
                  Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2.5"
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              {/* Title */}

              <div>
                <label className="mb-1 block font-medium">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-2.5"
                  placeholder="Example: Grocery shopping"
                />
              </div>

              {/* Amount */}

              <div>
                <label className="mb-1 block font-medium">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-lg border p-2.5"
                  placeholder="Enter amount"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-1 block font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2.5"
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

              {/* Payment Method */}

              <div>
                <label className="mb-1 block font-medium">
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2.5"
                >
                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                    >
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}

              <div>
                <label className="mb-1 block font-medium">
                  Date
                </label>

                <input
                  type="date"
                  name="transactionDate"
                  value={form.transactionDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border p-2.5"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-1 block font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-2.5"
                  rows="3"
                  placeholder="Optional"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? 'Saving...'
                  : 'Save Transaction'}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Transactions