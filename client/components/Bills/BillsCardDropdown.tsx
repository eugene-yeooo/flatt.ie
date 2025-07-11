import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useDeleteBill } from '../../hooks/useBills'
import { useDeletePaymentsByBillId } from '../../hooks/usePayment'
import { Pencil, Edit3, Trash2 } from 'lucide-react'
import { UpdateBillData } from 'models/models'
import useCanEdit from '../../hooks/useCanEdit'

export default function BillsCardDropdown({
  id,

  setShowUpdateBill,
  setSelectedBill,
}: {
  id: number

  setShowUpdateBill: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedBill: React.Dispatch<React.SetStateAction<UpdateBillData | null>>
}) {
  const deleteBill = useDeleteBill()
  const deletePayments = useDeletePaymentsByBillId()
  const canEdit = useCanEdit()
  function handleDelete() {
    deleteBill.mutate(id)
    // deletePayments.mutate(id, {
    //   onSuccess: () => {
    //     deleteBill.mutate(id)
    //   },
    //   onError: (err) => {
    //     console.error('Failed to delete payments:', err)
    //   },
    // })
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {canEdit && (
          <button
            className="absolute right-4 top-4 text-gray-300 hover:text-black"
            aria-label="edit bill"
          >
            <Pencil size={18} />
          </button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-35 z-50 rounded border bg-white py-2 shadow-md"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            onSelect={() => {
              setSelectedBill(id)
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
