import { useEffect, useState } from 'react'
import { User } from 'models/models'
import { useGetBillById, useUpdateBill } from '../../hooks/useBills'
// import { useUpdatePayments } from '../../hooks/usePayment'
import BillForm from './BillForm'

type Share = { userId: string; split: string; paid: boolean }

export default function UpdateBill({
  billId,
  onClose,
}: {
  billId: number
  onClose: () => void
}) {
  const [users, setUsers] = useState<User[]>([])
  const updateBill = useUpdateBill()
  // const updatePayments = useUpdatePayments()
  const { data: bill, isPending, error } = useGetBillById(billId)
  console.log(bill)
  useEffect(() => {
    async function fetchFlatmates() {
      try {
        const res = await fetch('/api/v1/users')
        if (!res.ok) throw new Error('Failed to fetch flatmates')
        const data = await res.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching flatmates:', error)
      }
    }

    fetchFlatmates()
  }, [])

  if (isPending || !bill) return null

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

    updateBill.mutate(
      {
        id: updatedBill.id,
        title: updatedBill.title,
        dueDate: updatedBill.due_date,
        totalAmount: updatedBill.total_amount,
        expense_category: updatedBill.expense_category,
      },
      {
        onSuccess: () => {
          // updatePayments.mutate({
          //   billId: updatedBill.id,
          //   payments: shares.map((s) => {
          //     const amount = parseFloat(s.split)
          //     const split = amount / updatedBill.total_amount
          //     return {
          //       flatmate_id: Number(s.flatmateId),
          //       split,
          //       paid: s.paid,
          //       amount,
          //     }
          //   }),
          // })
          onClose()
        },
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
