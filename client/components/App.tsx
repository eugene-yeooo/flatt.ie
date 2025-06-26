<<<<<<< 28-getallexpenses-full-stack-route
import { useExpense } from '../hooks/useExpense.ts'
import { Expense } from '../../models/models.ts'

function App() {
  const { data: expenses, isLoading, error } = useExpense()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading expenses</div>

  return (
    <div className="app">
      <h1 className="text-3xl font-bold underline">
        Fullstack Boilerplate - with Fruits!
      </h1>

      <ul>
        {expenses.map((expense: Expense) => (
          <li key={expense.id}>
            {expense.type} - {expense.frequency} - ${expense.default_amount}
          </li>
        ))}
      </ul>
=======
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Bills from './Bills/Bills'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <nav className="bg-white px-6 py-4 shadow-md">
        <div>
          <Link to="/" className="text-xl font-bold text-blue-600">
            FlatFunds
          </Link>
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <div className="flex space-x-4">
            <Link to="/" className="px-4 py-2 hover:text-blue-500">
              Dashboard
            </Link>
            <Link to="/bills" className="px-4 py-2 hover:text-blue-500">
              Bills
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/" element={<Dashboard payments={[]} />} />
          <Route path="/bills" element={<Bills />} />
        </Routes>
      </main>
>>>>>>> main
    </div>
  )
}

export default App
