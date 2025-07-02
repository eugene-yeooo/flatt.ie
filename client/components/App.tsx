import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Expenses from './Expenses/Expenses'
import Navigation from './Navigation'
import Report from './Reports/Reports'
import Flatties from './Flatties/Flatties'
import Front from './Front'
import { useAuth0 } from '@auth0/auth0-react'
import Home from './Home/Home'
import Register from './Register/CreateUser'
import { useEffect } from 'react'
import { useUser } from '../../client/hooks/useUser'
import { useLocation } from 'react-router-dom'
import Profile from './Profile/Profile'
export default function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const user = useUser()
  const location = useLocation()
  const hideNav = location.pathname === '/register'

  //useUser hook in compoents to know roles

  useEffect(() => {
    if (isAuthenticated) {
      const getToken = async () => {
        const token = await getAccessTokenSilently()
        // console.log(token)
      }
      getToken()
    }

    if (!user.data && isAuthenticated) navigate('/register')
  }, [user.data, navigate, isAuthenticated])

  if (!isAuthenticated) {
    return <Front />
  }

  //REPORTS SAMPLE DATA
  const sampleData = [
    {
      category: 'Rent',
      monthlyAmounts: [
        1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200,
      ],
    },
    {
      category: 'Utilities',
      monthlyAmounts: [
        150, 140, 160, 145, 155, 150, 148, 152, 149, 147, 150, 153,
      ],
    },
    {
      category: 'Groceries',
      monthlyAmounts: [
        300, 320, 310, 305, 315, 325, 330, 335, 320, 310, 300, 295,
      ],
    },
  ]

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

            <nav className="flex-1">
              <Navigation />
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/flattie" element={<Home />} />
          <Route path="/payments" element={<Dashboard />} />
          <Route path="/flatmates" element={<Flatties />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/expense" element={<Expenses />} />
          <Route path="/report" element={<Report data={sampleData} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
