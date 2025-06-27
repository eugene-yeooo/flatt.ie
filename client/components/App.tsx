import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Expenses from './Expenses/Expenses'
import Navigation from './Navigation'
import Report from './Reports/Reports'
import { LogOut } from 'lucide-react'
import Flatties from './Flatties/Flatties'
import { useAuth0 } from '@auth0/auth0-react'

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

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
      className="min-h-screen text-foreground"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <header
        className="px-6 py-4 shadow-md"
        style={{
          backgroundColor: 'var(--card)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl justify-center">
          <Link
            to="/"
            className="inline-block text-4xl font-extrabold tracking-tight"
            style={{
              color: 'var(--primary)',
              textShadow: '1px 1px 2px var(--border)',
            }}
          >
            FlatFunds
          </Link>
          <div className="flex items-center justify-end px-2 py-2">
            <div className="flex items-center gap-4 text-sm">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Hey, {user?.name}!</span>
                  <button
                    onClick={() =>
                      logout({
                        logoutParams: { returnTo: window.location.origin },
                      })
                    }
                    className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
                  >
                    <LogOut />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Navigation />

      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flatmates" element={<Flatties />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/expense" element={<Expenses />} />
          <Route path="/report" element={<Report data={sampleData} />} />
          <Route path="/flatmates" element={<Flatties />} />
        </Routes>
      </main>
    </div>
  )
}
