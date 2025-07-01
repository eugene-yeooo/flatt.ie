import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useDeleteExpense } from '../../hooks/useExpense'
import { Pencil, Edit3, Trash2 } from 'lucide-react'
import { Expense } from 'models/models'

export default function ExpenseCardDropdown({
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
}: {
  id: number
  category: string
  frequency: 'weekly' | 'monthly' | 'one_off'
  start_date: Date
  end_date: Date
  default_amount: number
  calc_method: 'split' | 'manual'
  notes: string
  setShowUpdateExpense: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedExpense: React.Dispatch<React.SetStateAction<Expense | null>>
}) {
  const deleteExpense = useDeleteExpense()

  function handleDelete() {
    deleteExpense.mutate(id)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-black"
          aria-label="edit expense"
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
              setSelectedExpense({
                id,
                category,
                frequency,
                start_date: start_date.toISOString().split('T')[0],
                end_date: end_date.toISOString().split('T')[0],
                default_amount: default_amount,
                calc_method,
                notes,
              })
              setShowUpdateExpense(true)
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
