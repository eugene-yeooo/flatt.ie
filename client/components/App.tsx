import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'
import Navigation from './Navigation'
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-white px-6 py-4 shadow-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link to="/" className="text-xl font-bold text-blue-600">
              FlatFunds 💸
            </Link>
          </div>
        </header>

        {/* Tab Navigation */}
        <Navigation />

        <main className="mx-auto max-w-5xl p-4">
          <Routes>
            <Route path="/" element={<Dashboard payments={[]} />} />
            <Route path="/bills" element={<Bills />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
