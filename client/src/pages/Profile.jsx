import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'

function Profile() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const [profile, setProfile] = useState({
    name: '',
    email: ''
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  })

  const [stats, setStats] = useState({
    transactions: 0,
    totalIncome: 0,
    totalExpense: 0,
    savings: 0
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load user details and account statistics
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || ''
      })
    }

    const loadStats = async () => {
      try {
        const response = await getAccountStats()

        setStats(
          response.data.data || {
            transactions: 0,
            totalIncome: 0,
            totalExpense: 0,
            savings: 0
          }
        )
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load account statistics'
        )
      }
    }

    loadStats()
  }, [user])

  // Update profile
  const saveProfile = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    try {
      await dispatch(
        updateProfileThunk({
          name: profile.name,
          email: profile.email
        })
      ).unwrap()

      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to update profile'
      )
    }
  }

  // Change password
  const savePassword = async (event) => {
    event.preventDefault()

    setMessage('')
    setError('')

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })

      setPasswords({
        currentPassword: '',
        newPassword: ''
      })

      setMessage('Password changed successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to change password'
      )
    }
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-slate-600">
          Manage your account details, password and financial statistics.
        </p>
      </div>

      {/* Success Message */}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* User Details */}

        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">

          <h2 className="text-xl font-semibold">
            User Details
          </h2>

          <form
            onSubmit={saveProfile}
            className="mt-4 grid gap-4 md:grid-cols-2"
          >

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Name
              </label>

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value
                  })
                }
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Save */}

            <div className="md:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                Save Profile
              </button>

            </div>

          </form>

          {/* Change Password */}

          <div className="mt-8 border-t pt-6">

            <h2 className="text-xl font-semibold">
              Change Password
            </h2>

            <form
              onSubmit={savePassword}
              className="mt-4 grid gap-4 md:grid-cols-2"
            >

              {/* Current Password */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current Password
                </label>

                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* New Password */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>

                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value
                    })
                  }
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* Change Password */}

              <div className="md:col-span-2">

                <button
                  type="submit"
                  className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white hover:bg-slate-900"
                >
                  Change Password
                </button>

              </div>

            </form>

          </div>

        </section>

        {/* Account Statistics */}

        <section className="rounded-lg border bg-white p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Account Statistics
          </h2>

          <div className="mt-5 space-y-4">

            {/* Transactions */}

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Transactions
              </p>

              <p className="mt-1 text-2xl font-bold">
                {stats.transactions ||
                  stats.transactionCount ||
                  stats.totalTransactions ||
                  0}
              </p>
            </div>

            {/* Income */}

            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-700">
                Income
              </p>

              <p className="mt-1 text-2xl font-bold text-green-800">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>

            {/* Expenses */}

            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-red-800">
                {formatCurrency(stats.totalExpense)}
              </p>
            </div>

            {/* Savings */}

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                Savings
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-800">
                {formatCurrency(stats.savings)}
              </p>
            </div>

          </div>

        </section>

      </div>

    </div>
  )
}

export default Profile