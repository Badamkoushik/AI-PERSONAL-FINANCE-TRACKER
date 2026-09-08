// import { useState } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { signupUser } from '../redux/slices/authSlice'

// function Signup() {
//   // state: formData ({ name, email, password, confirmPassword }), error (local)
//   // redux: { loading } from state.auth
//   // hooks: navigate (react-router), dispatch (redux)

//   // handleChange(e) → update formData field by input name
//   // handleSubmit(e) → preventDefault, validate password === confirmPassword,
//   //                   dispatch signupUser with { name, email, password },
//   //                   navigate to /dashboard on success, set error on failure

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
//         {/* App title: "FinTrack" */}

//         {/* if error → red error banner */}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             {/* Full Name label + text input (controlled, required) */}
//           </div>

//           <div className="mb-4">
//             {/* Email label + email input (controlled, required) */}
//           </div>

//           <div className="mb-4">
//             {/* Password label + password input (controlled, required) */}
//           </div>

//           <div className="mb-6">
//             {/* Confirm Password label + password input (controlled, required) */}
//           </div>

//           {/* Submit button → shows "Creating account..." when loading, else "Sign Up" */}
//         </form>

//         {/* "Already have an account?" text + Link to /login */}
//       </div>
//     </div>
//   )
// }

// export default Signup
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../redux/slices/authSlice'

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()

      navigate('/dashboard')
    } catch (err) {
      setError(err || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          FinTrack
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Create a password"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup