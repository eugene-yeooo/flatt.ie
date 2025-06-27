import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useDeleteBill } from '../../hooks/useBills'
import { Pencil, Edit3, Trash2 } from 'lucide-react'
import { UpdateBillData } from 'models/models'

export default function BillsCardDropdown({
  id,
  title,
  dueDate,
  totalAmount,
  expenseCategory,
  setShowUpdateBill,
  setSelectedBill,
}: {
  id: number
  title: string
  dueDate: Date
  totalAmount: number
  expenseCategory?: string
  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedBill: React.Dispatch<React.SetStateAction<UpdateBillData | null>>
}) {
  const deleteBill = useDeleteBill()

  function handleDelete() {
    deleteBill.mutate(id)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-black"
          aria-label="edit bill"
        >
          <Pencil size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-35 z-50 rounded border bg-white py-2 shadow-md"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            onSelect={() => {
              setSelectedBill({
                id,
                title,
                due_date: dueDate.toISOString().split('T')[0],
                total_amount: totalAmount,
                expense_category: expenseCategory,
              })
              setShowUpdateBill(true)
            }}
            className="flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100"
          >
            <Edit3 size={16} className="mr-2" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={handleDelete}
            className="flex cursor-pointer items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
