import { useEffect, useState } from 'react'
import { Flatmate, UpdateBillData } from 'models/models'
import { useUpdateBill } from '../../hooks/useBills'
// import { useUpdatePayments } from '../../hooks/usePayment'
import BillForm from './BillForm'

type Share = { flatmateId: string; split: string; paid: boolean }

export default function UpdateBill({
  bill,
  onClose,
}: {
  bill: UpdateBillData & { payments: Share[] }
  onClose: () => void
}) {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const updateBill = useUpdateBill()
  const updatePayments = useUpdatePayments()

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
        due_date: updatedBill.due_date,
        total_amount: updatedBill.total_amount,
        expense_category: updatedBill.expense_category,
      },
      {
        onSuccess: () => {
          updatePayments.mutate({
            billId: updatedBill.id!,
            payments: shares.map((s) => {
              const amount = parseFloat(s.split)
              const split = amount / updatedBill.total_amount
              return {
                flatmate_id: Number(s.flatmateId),
                split,
                paid: s.paid,
                amount,
              }
            }),
          })
          onClose()
        },
      },
    )
  }

  return (
    <>
      {flatmates.length > 0 && (
        <BillForm
          flatmates={flatmates}
          initialData={bill}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Update Bill"
        />
      )}
    </>
  )
}
