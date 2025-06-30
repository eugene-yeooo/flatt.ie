import ExpenseCard from './ExpensesCard'
import { useAllExpense } from '../../hooks/useExpense'
import AddExpense from './AddExpense'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { useUser } from '../../hooks/useUser'

export default function Expensess() {
  const { data: expenses, isPending, error } = useAllExpense()
  const [showAddExpense, setShowAddExpense] = useState(false)
  const user = useUser()
  function toggleAddExpense() {
    setShowAddExpense((prev) => !prev)
  }
  const hideEdits = user?.data?.account_type === 'flat_financer'

  if (isPending) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">Error loading expenses.</p>
  if (!expenses || expenses.length === 0)
    return (
      <div className="p-4">
        <div className="btn flex justify-end bg-primary">
          <Button onClick={toggleAddExpense}>
            {showAddExpense ? 'Cancel' : 'Add Expense'}
          </Button>
        </div>
        <AddExpense onAddExpense={handleAddExpense} />
        <p>No expenses found.</p>
      </div>
    )
  console.log(expenses)

  function handleAddExpense() {
    setShowAddExpense(false)
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex justify-end bg-primary">
        {hideEdits && (
          <Button onClick={toggleAddExpense} className="btn">
            Add Expense
          </Button>
        )}
      </div>

      {showAddExpense && <AddExpense onAddExpense={handleAddExpense} />}

      <div
        className="mt-4 grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              category={expense.category}
              frequency={expense.frequency}
              default_amount={expense.default_amount}
              calc_method={expense.calc_method}
              notes={expense.notes}
            />
          ))
        )}
      </div>
    </div>
  )
}
