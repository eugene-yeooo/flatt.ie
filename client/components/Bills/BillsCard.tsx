import { Badge } from '@/components/components/ui/badge'
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
    <div className="relative rounded-md bg-white p-4 shadow">
      {/* Badge positioned top-right */}
      {expense_category && (
        <Badge
          variant="secondary"
          className="absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-semibold uppercase"
        >
          {expense_category}
        </Badge>
      )}

      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">
          Due: {due_date.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-700">
          Amount: ${total_amount.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
