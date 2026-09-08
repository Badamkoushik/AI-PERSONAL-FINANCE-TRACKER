import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budget', path: '/budget' },
    { label: 'Insights', path: '/insights' },
    { label: 'Reports', path: '/reports' },
    { label: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-primary text-white h-screen flex flex-col">

      {/* Logo / Title */}

      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">
          FinTrack
        </h1>

        <p className="mt-1 text-sm text-gray-300">
          AI Finance Tracker
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">

        <div className="space-y-2">

          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-lg px-4 py-3 font-medium transition ${
                isActive(item.path)
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}

        </div>

      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-gray-700">

        <button
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-3 text-left font-medium text-white hover:bg-white/10"
        >
          Logout
        </button>

      </div>

    </aside>
  )
}

export default Sidebar