import { useAddNewBill } from '../../hooks/useBills'
import { useAddPayments } from '../../hooks/usePayment'
import BillForm from './BillForm'
import { Share } from 'models/models'
import { useAllUsers } from '../../hooks/useUser'

export default function AddBill({ onAddBill }: { onAddBill: () => void }) {
  const createBill = useAddNewBill()
  const createPayments = useAddPayments()
  const { data: users, isPending, error } = useAllUsers()
  // console.log('Users:', users)
  if (isPending) return <p>Loading...</p>
  if (error) return <p>Error loading users</p>

  function handleSubmit({
    bill,
    shares,
  }: {
    bill: Omit<
      {
        id?: number
        title: string
        due_date: string
        total_amount: number
        expense_category: string
      },
      'id'
    >
    shares: Share[]
  }) {
    console.log(
      'Mapped payments:',
      shares.map((s) => ({
        user_id: Number(s.userId),
        split: parseFloat(s.split) / bill.total_amount,
        paid: s.paid,
        amount: parseFloat(s.split),
      })),
    )

    createBill.mutate(
      {
        title: bill.title,
        due_date: bill.due_date,
        total_amount: bill.total_amount,
        expense_category: bill.expense_category,
      },
      {
        onSuccess: (newBillId) => {
          createPayments.mutate({
            billId: newBillId,
            payments: shares.map((s) => {
              const percent = parseFloat(s.split) // percent, e.g. 25
              const amount = (percent / 100) * bill.total_amount
              const split = percent / 100

              return {
                user_id: Number(s.userId),
                split,
                paid: s.paid,
                amount: amount,
              }
            }),
          })

          onAddBill()
        },
      },
    )
  }

  return (
    <>
      {users && users.length > 0 && (
        <BillForm
          users={users}
          onSubmit={handleSubmit}
          onCancel={onAddBill}
          submitLabel="Add Bill"
        />
      )}
    </>
  )
}
