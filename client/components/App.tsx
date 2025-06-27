import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Expenses from './Expenses/Expenses'
import Navigation from './Navigation'
import Report from './Reports/Reports'

import Flatties from './Flatties/Flatties'

export default function App() {
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
