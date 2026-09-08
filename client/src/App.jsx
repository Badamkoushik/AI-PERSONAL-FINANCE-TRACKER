// // import { useEffect } from 'react'
// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   Navigate,
// //   Outlet,
// // } from 'react-router-dom'
// // import './App.css'

// // // Pages
// // import Login from './pages/Login'
// // import Signup from './pages/Signup'
// // import Dashboard from './pages/Dashboard'
// // import Transactions from './pages/Transactions'
// // import Budget from './pages/Budget'
// // import Insights from './pages/Insights'
// // import Reports from './pages/Reports'
// // import Profile from './pages/Profile'

// // // Layout 
// // import Layout from './components/layout/Layout'

// // // Redux
// // import { useDispatch, useSelector } from 'react-redux'
// // import { refreshUser } from './redux/slices/authSlice'

// // function ProtectedRoute() {
// //   const { isAuthenticated } = useSelector((state) => state.auth)

// //   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
// // }

// // function App() {
// //   const dispatch = useDispatch()

// //   useEffect(() => {
// //     const token = localStorage.getItem('token')

// //     if (token) {
// //       dispatch(refreshUser())
// //     }
// //   }, [dispatch])

// //   return (
// //     <Router>
// //       <Routes>
// //         {/* Public routes */}
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/signup" element={<Signup />} />

// //         {/* Protected routes */}
// //         <Route element={<ProtectedRoute />}>
// //           <Route element={<Layout />}>
// //             <Route path="/dashboard" element={<Dashboard />} />
// //             <Route path="/transactions" element={<Transactions />} />
// //             <Route path="/budget" element={<Budget />} />
// //             <Route path="/insights" element={<Insights />} />
// //             <Route path="/reports" element={<Reports />} />
// //             <Route path="/profile" element={<Profile />} />
// //           </Route>
// //         </Route>

// //         {/* Default route */}
// //         <Route
// //           path="/"
// //           element={<Navigate to="/dashboard" replace />}
// //         />

// //         {/* Catch-all route */}
// //         <Route
// //           path="*"
// //           element={<Navigate to="/dashboard" replace />}
// //         />
// //       </Routes>
// //     </Router>
// //   )
// // }
// // export default App


// // // import { useEffect } from 'react'
// // // import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
// // // import './App.css'

// // // // Pages
// // // import Login from './pages/Login'
// // // import Signup from './pages/Signup'
// // // import Dashboard from './pages/Dashboard'
// // // import Transactions from './pages/Transactions'
// // // import Budget from './pages/Budget'
// // // import Insights from './pages/Insights'
// // // import Reports from './pages/Reports'
// // // import Profile from './pages/Profile'

// // // // Layout
// // // import Layout from './components/layout/Layout'

// // // // Redux
// // // import { useDispatch, useSelector } from 'react-redux'
// // // import { refreshUser } from './redux/slices/authSlice'

// // // // ProtectedRoute → reads { isAuthenticated } from state.auth;
// // // //                  renders <Outlet /> when authenticated, else <Navigate to="/login" replace />
// // // function ProtectedRoute() {
// // //   // ...
// // // }

// // // function App() {
// // //   // redux: dispatch

// // //   // useEffect (on mount) → if token exists in localStorage → dispatch(refreshUser())

// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         {/* Public routes: /login, /signup */}

// // //         {/* Protected routes (wrapped in <ProtectedRoute /> and <Layout />):
// // //             /dashboard, /transactions, /budget, /insights, /reports, /profile
// // //             "/" → redirect to /dashboard */}

// // //         {/* Catch-all "*" → redirect to /dashboard */}
// // //       </Routes>
// // //     </Router>
// // //   )
// // // }

// // // export default App
// import { useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
// import './App.css'

// // Pages
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// import Dashboard from './pages/Dashboard'
// import Transactions from './pages/Transactions'
// import Budget from './pages/Budget'
// import Insights from './pages/Insights'
// import Reports from './pages/Reports'
// import Profile from './pages/Profile'

// // Layout
// import Layout from './components/layout/Layout'

// // Redux
// import { useDispatch, useSelector } from 'react-redux'
// import { refreshUser } from './redux/slices/authSlice'

// function ProtectedRoute() {
//   const { isAuthenticated } = useSelector((state) => state.auth)

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }

//   return <Outlet />
// }

// function App() {
//   const dispatch = useDispatch()
//   const { token } = useSelector((state) => state.auth)

//   useEffect(() => {
//     if (token) {
//       dispatch(refreshUser())
//     }
//   }, [token, dispatch])

//   return (
//     <Router>
//       <Routes>
//         Public routes
//         {/* <Route path="/login" element={<Login />} /> */}
//         {/* <Route path="/signup" element={<Signup />} /> */}

//         {/* Protected routes */}
//         {/* <Route element={<ProtectedRoute />}>
//           <Route element={<Layout />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/transactions" element={<Transactions />} />
//             <Route path="/budget" element={<Budget />} />
//             <Route path="/insights" element={<Insights />} />
//             <Route path="/reports" element={<Reports />} />
//             <Route path="/profile" element={<Profile />} />
//           </Route>
//         </Route> */}
//         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//         {/* <Route path="/dashboard" element={<Layout />} /> */}
//         {/* Default route */}
//         {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

//         {/* Catch-all */}
//         {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
//       </Routes>
//     </Router>
//   )
// }

// export default App
import { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'

import './App.css'

// Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Insights from './pages/Insights'
import Reports from './pages/Reports'
import Profile from './pages/Profile'

// Layout
import Layout from './components/layout/Layout'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { refreshUser } from './redux/slices/authSlice'

// Protected Route
function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(refreshUser())
    }
  }, [token, dispatch])

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard + Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Other pages - temporarily without authentication */}
        <Route element={<Layout />}>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Catch-all Route */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </Router>
  )
}

export default App