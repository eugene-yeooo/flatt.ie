import { Expense } from 'models/models'
import ExpenseCardDropdown from './ExpensesCardDropdown'
interface ExpensesCardProps {
  id: number
  category: string
  frequency: 'weekly' | 'monthly' | 'one_off'
  start_date: Date
  end_date: Date
  default_amount: number | null
  calc_method: 'split' | 'manual'
  notes?: string
  setShowUpdateExpense: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedExpense: React.Dispatch<React.SetStateAction<Expense | null>>
}
const frequencyOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'One Off', value: 'one_off' },
]
const calcOptions = [
  { label: 'Split', value: 'split' },
  { label: 'Manual', value: 'manual' },
]

export default function ExpensesCard({
  id,
  category,
  frequency,
  start_date,
  end_date,
  default_amount,
  calc_method,
  notes,
  setShowUpdateExpense,
  setSelectedExpense,
}: ExpensesCardProps) {
  const frequencyLabel =
    frequencyOptions.find((opt) => opt.value === frequency)?.label || frequency
  const calcLabel =
    calcOptions.find((opt) => opt.value === calc_method)?.label || calc_method

  return (
    <div className="relative rounded-md bg-white p-4 shadow">
      <div className="absolute right-2 top-1">
        <ExpenseCardDropdown
          id={id}
          category={category}
          frequency={frequency}
          start_date={start_date}
          end_date={end_date}
          default_amount={default_amount ?? 0}
          calc_method={calc_method}
          notes={notes ?? ''}
          setShowUpdateExpense={setShowUpdateExpense}
          setSelectedExpense={setSelectedExpense}
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{category}</h2>
        <p className="text-sm text-gray-500">Frequency: {frequencyLabel}</p>
        {['weekly', 'monthly'].includes(frequency) && (
          <>
            <p className="text-sm text-gray-500">
              Start Date: {start_date.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              End Date: {end_date.toLocaleDateString()}
            </p>
          </>
        )}
        <p className="text-sm text-gray-700">
          Amount: ${default_amount?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">Payment method: {calcLabel}</p>
        <p className="text-sm text-gray-500">notes: {notes}</p>
      </div>
    </div>
  )
}
