import ExpenseCard from './ExpensesCard'
import { useAllExpense } from '../../hooks/useExpense'
import AddExpense from './AddExpense'
import { useState } from 'react'
import { Button } from '@/components/components/ui/button'
import { Expense } from 'models/models'
import UpdateExpense from './UpdateExpense'
import useCanEdit from '../../hooks/useCanEdit'

export default function Expenses() {
  const { data: expenses, isPending, error } = useAllExpense()
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showUpdateExpense, setShowUpdateExpense] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const canEdit = useCanEdit()

  function toggleAddExpense() {
    setShowAddExpense((prev) => !prev)
  }

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
        {canEdit && (
          <Button onClick={toggleAddExpense} className="btn">
            Add Expense
          </Button>
        )}
      </div>

      {showAddExpense && <AddExpense onAddExpense={handleAddExpense} />}

      {showUpdateExpense && selectedExpense && (
        <UpdateExpense
          setShowUpdateExpense={setShowUpdateExpense}
          expense={selectedExpense}
        />
      )}

      <div
        className="mt-4 grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          expenses.map((expense) => {
            console.log('start_date:', expense)
            return (
              <ExpenseCard
                key={expense.id}
                id={expense.id}
                category={expense.category}
                frequency={expense.frequency}
                start_date={new Date(expense.start_date)}
                end_date={new Date(expense.end_date)}
                default_amount={expense.default_amount}
                calc_method={expense.calc_method}
                notes={expense.notes}
                setShowUpdateExpense={setShowUpdateExpense}
                setSelectedExpense={setSelectedExpense}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
