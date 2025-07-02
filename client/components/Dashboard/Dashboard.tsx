import { useAllPayment, useUpdatePaymentStatus } from '../../hooks/usePayment'
import { useAllUsers } from '../../hooks/useUser'

import PaymentCard from './PaymentCard'

export default function Dashboard() {
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isError: paymentsError,
  } = useAllPayment()
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = useAllUsers()
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdatePaymentStatus()

  if (paymentsLoading || usersLoading) return <p>Loading...</p>
  if (paymentsError) return <p>Error loading payments.</p>
  if (usersError) return <p>Error loading users.</p>

  // Group payments by bill title
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
    <div className="grid grid-cols-2 gap-6 ">
      {Object.entries(paymentsByBill)
        .filter(([, billPayments]) => {
          const dueDate = new Date(billPayments[0]?.dueDate)
          const now = new Date()
          const diffTime = dueDate.getTime() - now.getTime()
          const diffDays = diffTime / (1000 * 60 * 60 * 24)
          return diffDays >= -30 && diffDays <= 30
        })
        .map(([billTitle, billPayments]) => (
          <PaymentCard
            key={billTitle}
            billTitle={billTitle}
            billPayments={billPayments}
            isUpdating={isUpdating}
            onTogglePaid={handlePaymentStatus}
            billAmount={billPayments[0]?.billTotal ?? 0}
            billDueDate={billPayments[0]?.dueDate}
            flatmates={users}
          />
        ))}
    </div>
  )
}
