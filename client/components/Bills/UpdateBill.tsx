import { useEffect, useState } from 'react'
import { Flatmate, Share } from 'models/models'
import { useGetBillById, useUpdateBillAndPayments } from '../../hooks/useBills'
import BillForm from './BillForm'

export default function UpdateBill({
  billId,
  onClose,
}: {
  billId: number
  onClose: () => void
}) {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const mutation = useUpdateBillAndPayments()
  const { data: bill, isPending, error } = useGetBillById(billId)
  console.log(bill)

  useEffect(() => {
    async function fetchFlatmates() {
      try {
        const res = await fetch('/api/v1/flatties')
        if (!res.ok) throw new Error('Failed to fetch flatmates')
        const data = await res.json()
        setFlatmates(data)
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
      flatmates={flatmates}
      initialData={bill}
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitLabel="Update Bill"
    />
  )
}
