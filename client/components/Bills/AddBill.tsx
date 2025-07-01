import { useAddNewBill } from '../../hooks/useBills'
import { useAddPayments } from '../../hooks/usePayment'
import { useEffect, useState } from 'react'
import BillForm from './BillForm'
import { Flatmate } from 'models/models'

export default function AddBill({ onAddBill }: { onAddBill: () => void }) {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const createBill = useAddNewBill()
  const createPayments = useAddPayments()

  useEffect(() => {
    async function fetchFlatmates() {
      try {
        const res = await fetch('/api/v1/users')
        if (!res.ok) throw new Error('Failed to fetch flatmates')
        const data = await res.json()
        setFlatmates(data)
      } catch (error) {
        console.error('Failed to fetch flatmates:', error)
      }
    }
    fetchFlatmates()
  }, [])

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
    shares: { flatmateId: string; split: string; paid: boolean }[]
  }) {
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
              const amount = parseFloat(s.split)

              const split = amount / bill.total_amount

              return {
                flatmate_id: Number(s.flatmateId),
                split,
                paid: s.paid,
                amount,
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
      {flatmates.length > 0 && (
        <BillForm
          flatmates={flatmates}
          onSubmit={handleSubmit}
          onCancel={onAddBill}
          submitLabel="Add Bill"
        />
      )}
    </>
  )
}
