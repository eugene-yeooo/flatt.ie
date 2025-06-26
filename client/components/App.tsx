import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Navigation from './Navigation'

export default function App() {
  return (
    <div
      className="text-foreground min-h-screen"
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
          <Route path="/" element={<Dashboard payments={[]} />} />
          <Route path="/bills" element={<Bills />} />
        </Routes>
      </main>
    </div>
  )
}
