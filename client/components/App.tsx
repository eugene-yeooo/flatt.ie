import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Expenses from './Expenses/Expenses'
import Navigation from './Navigation'
import Flatties from './Flatties/Flatties'
import Front from './Front'
import { useAuth0 } from '@auth0/auth0-react'
import Home from './Home/Home'
import Register from './Register/CreateUser'
import { useEffect, useState } from 'react'
import { useUser } from '../../client/hooks/useUser'
import { useLocation } from 'react-router-dom'
import Profile from './Profile/Profile'
import ReportsPage from './Reports/ReportsPage'

export default function App() {
  const { isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const user = useUser()
  const location = useLocation()
  const hideNav = location.pathname === '/register'
  const [selected, setSelected] = useState(false)

  //useUser hook in compoents to know roles

  useEffect(() => {
    if (
      isAuthenticated &&
      !user.isLoading &&
      !user.data &&
      location.pathname !== '/register'
    ) {
      navigate('/register')
    }
  }, [isAuthenticated, user.isLoading, user.data, location.pathname, navigate])

  useEffect(() => {
    if (
      isAuthenticated &&
      !user.isLoading &&
      user.data &&
      (location.pathname === '/' || location.pathname === '')
    ) {
      navigate('/flattie')
    }
  }, [isAuthenticated, user.isLoading, user.data, location.pathname, navigate])
  if (isAuthenticated && user.isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--background)',
        }}
      >
        <div style={{ width: '300px' }}>...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Front />
  }

  return (
    <div
      className="min-h-screen bg-[var(--background)] text-foreground"
      style={{ color: 'var(--foreground)' }}
    >
      <header
        className=" px-6 py-4"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
        }}
        role="banner"
      >
        {!hideNav && (
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
            <Link
              to="/flattie"
              style={{ backgroundColor: 'var(--background)' }}
              className="rounded-xl border-8 border-white px-3 py-2 text-4xl font-extrabold tracking-tight text-[var(--primary)] shadow drop-shadow-[1px_1px_2px_var(--border)] backdrop-blur-sm "
              aria-label="Flatt.ie Home"
            >
              flatt.ie
            </Link>

            <nav className="flex">
              <Navigation />
            </nav>
            {/* User avatar/profile */}
            <div className="rounded-xl bg-white px-3 py-2 shadow backdrop-blur-sm ">
              {user?.data?.avatar_url ? (
                <Link to="/profile" aria-label="Go to your profile">
                  <img
                    src={user.data.avatar_url}
                    alt={`${user.data.username || 'User'} avatar`}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--primary)] transition duration-200 hover:ring-[var(--accent)]"
                  />
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="ring-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-semibold ring-[var(--primary)] transition duration-200 hover:ring-white"
                  aria-label="Go to your profile"
                >
                  {user?.data?.username?.[0]?.toUpperCase() || 'U'}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {hideNav ? (
        // Render the Register component full width, no padding or shadow wrapper
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        // Your usual main container for all other pages
        <main className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
          <Routes>
            <Route path="/" element={<Front />} />
            <Route path="/flattie" element={<Home />} />
            <Route path="/payments" element={<Dashboard />} />
            <Route path="/flatmates" element={<Flatties />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/expense" element={<Expenses />} />
            <Route path="/report" element={<ReportsPage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      )}
    </div>
  )
}
