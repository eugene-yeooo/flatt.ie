import { useAllPayment, useUpdatePaymentStatus } from '../../hooks/usePayment'

import PaymentCard from './PaymentCard'

export default function Dashboard() {
  const { data: payments = [], isLoading, isError } = useAllPayment()
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdatePaymentStatus()

  if (isLoading) return <p>Loading payments...</p>
  if (isError) return <p>Error loading payments.</p>

  const paymentsByBill = payments.reduce(
    (acc, payment) => {
      const key = payment.billTitle || 'Unknown Bill'
      if (!acc[key]) acc[key] = []
      acc[key].push(payment)
      return acc
    },
    {} as Record<string, typeof payments>,
  )
  const handlePaymentStatus = async (id: number, paidStatus: boolean) => {
    updateStatus({ id, paid: paidStatus })
  }
  return (
    <div className=" gap-6 ">
      {Object.entries(paymentsByBill).map(([billTitle, billPayments]) => (
        <PaymentCard
          key={billTitle}
          billTitle={billTitle}
          billPayments={billPayments}
          isUpdating={isUpdating}
          onTogglePaid={handlePaymentStatus}
          billAmount={billPayments[0]?.billTotal ?? 0}
          billDueDate={billPayments[0]?.dueDate}
        />
      ))}
    </div>
  )
}
