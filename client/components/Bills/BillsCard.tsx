type BillCardProps = {
  id: number
  title: string
  due_date: Date
  total_amount: number
  expense_category?: string
}

export default function BillCard({
  title,
  due_date,
  total_amount,
  expense_category,
}: BillCardProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white p-4 shadow">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          Due: {due_date.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          Amount: ${total_amount.toFixed(2)}
        </p>
        {expense_category && (
          <p className="text-xs uppercase text-gray-400">{expense_category}</p>
        )}
      </div>
    </div>
  )
}
