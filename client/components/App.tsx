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
    </div>
  )
}

export default App
