import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Expenses from './Expenses/Expenses'
import Navigation from './Navigation'
import Report from './Reports/Reports'
import Flatties from './Flatties/Flatties'
import Authenticate from './Authenticate'
import Front from './Front'
import { useAuth0 } from '@auth0/auth0-react'

export default function App() {
  const { isAuthenticated } = useAuth0()

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link
            to="/"
            className="] text-4xl font-extrabold tracking-tight text-[var(--primary)] drop-shadow-[1px_1px_2px_var(--border)]"
            aria-label="Flatt.ie Home"
          >
            Flatt.ie
          </Link>

          <nav className="flex-1">
            <Navigation />
          </nav>

          <div>
            <Authenticate />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Routes>
          <Route path="/" element={<Front />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flatmates" element={<Flatties />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/expense" element={<Expenses />} />
          <Route path="/report" element={<Report data={sampleData} />} />
        </Routes>
      </main>
    </div>
  )
}
