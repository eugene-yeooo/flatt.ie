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
    <div
      className="relative rounded-xl p-4 shadow transition-colors"
      style={{ backgroundColor: 'var(--primary-foreground)' }}
    >
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
      <div className="rounded-xl p-6 px-3 py-3">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-[var(--primary)]">
          {category}
        </h2>
        <table className="w-full max-w-lg rounded-xl  bg-white  p-4 ">
          <tbody className=" text-sm text-[var(--muted-foreground)]">
            <tr>
              <td className="rounded px-3 py-3 font-medium text-[var(--foreground)]">
                Frequency
              </td>
              <td className="px-3 py-3">{frequencyLabel}</td>
            </tr>

            {['weekly', 'monthly'].includes(frequency) && (
              <>
                <tr>
                  <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                    Start Date
                  </td>
                  <td className="px-3 py-3">
                    {start_date.toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                    End Date
                  </td>
                  <td className="px-3 py-3">{end_date.toLocaleDateString()}</td>
                </tr>
              </>
            )}

            <tr>
              <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                Amount
              </td>
              <td className="px-3 py-3">${default_amount?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                Payment Method
              </td>
              <td className="px-3 py-3">{calcLabel}</td>
            </tr>
            {notes && (
              <tr>
                <td className="px-3 py-3 font-medium text-[var(--foreground)]">
                  Notes
                </td>
                <td className="px-3 py-3">{notes}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
