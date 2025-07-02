import { Share } from 'models/models'
import { useGetBillById, useUpdateBillAndPayments } from '../../hooks/useBills'
import BillForm from './BillForm'
import { useAllUsers } from '../../hooks/useUser'

export default function UpdateBill({
  billId,
  onClose,
}: {
  billId: number
  onClose: () => void
}) {
  const mutation = useUpdateBillAndPayments()
  const { data: bill, isPending, error } = useGetBillById(billId)
  const { data: users } = useAllUsers()
  // console.log('Users:', users)
  // console.log('Bill:', bill)

  if (!users) return <p>Loading users...</p>
  if (isPending || !bill) return null
  if (error) return <p>Error loading bill</p>

  function handleSubmit({
    bill: updatedBill,
    shares,
  }: {
    bill: {
      id?: number
      title: string
      due_date: string
      total_amount: number
      expense_category: string
    }
    shares: Share[]
  }) {
    if (!updatedBill.id) return

    mutation.mutate(
      {
        bill: {
          id: updatedBill.id,
          title: updatedBill.title,
          due_date: updatedBill.due_date,
          total_amount: updatedBill.total_amount,
          expense_category: updatedBill.expense_category,
        },
        shares: shares,
      },
      {
        onSuccess: () => onClose(),
      },
    )
  }

  if (isPending || !bill) return null

  return (
    <BillForm
      users={users}
      initialData={bill}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitLabel="Update Bill"
    />
  )
}
