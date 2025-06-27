interface ExpensesCardProps {
  category: string
  frequency: string
  default_amount: number | null
  calc_method: string
  notes?: string
}
const frequencyOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'One Off', value: 'one_off' },
]
const calcOptions = [
  { label: 'Fixed Split', value: 'fixed_split' },
  { label: 'Percentage Split', value: 'percentage_split' },
  { label: 'Manual', value: 'manual' },
]
export default function ExpensesCard({
  category,
  frequency,
  default_amount,
  calc_method,
  notes,
}: ExpensesCardProps) {
  return (
    <div className="relative rounded-md bg-white p-4 shadow">
      {/* Badge positioned top-right */}

      <div>
        <h2 className="text-lg font-semibold">{category}</h2>
        <p className="text-sm text-gray-500">Frequency: {frequency}</p>
        <p className="text-sm text-gray-700">
          Amount: ${default_amount?.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">Payment method: {calc_method}</p>
        <p className="text-sm text-gray-500">notes: {notes}</p>
      </div>
    </div>
  )
}
