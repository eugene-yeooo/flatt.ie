import { Badge } from '@/components/components/ui/badge'
import BillsCardDropdown from './BillsCardDropdown'
import { UpdateBillData } from 'models/models'
interface BillCardProps {
  id: number
  title: string
  dueDate: Date
  totalAmount: number
  expenseCategory?: string
  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedBill: React.Dispatch<React.SetStateAction<UpdateBillData | null>>
}
export default function BillCard({
  id,
  title,
  dueDate,
  totalAmount,
  expenseCategory,
  setShowUpdateBill,
  setSelectedBill,
}: BillCardProps) {
  return (
    <div className="relative rounded-md bg-white p-4 shadow">
      {/* Badge positioned top-right */}
      {expenseCategory && (
        <Badge
          variant="secondary"
          className="absolute right-6 top-2 rounded-full px-3 py-1 text-xs font-semibold uppercase"
        >
          {expenseCategory}
        </Badge>
      )}
      <BillsCardDropdown
        id={id}
        title={title}
        dueDate={dueDate}
        totalAmount={totalAmount}
        expenseCategory={expenseCategory}
        setShowUpdateBill={setShowUpdateBill}
        setSelectedBill={setSelectedBill}
      />
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">Due: {dueDate.toLocaleString()}</p>
        <p className="text-sm text-gray-700">
          Amount: ${totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
