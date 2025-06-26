import { useAllPayment } from '../../hooks/usePayment'
import { useUpdatePaymentStatus } from '../../hooks/usePayment'

export default function Dashboard() {
  const { data: payments = [], isLoading, isError } = useAllPayment()
  const {
    mutate: updateStatus,
    isPending: isUpdating,
    error: updateError,
  } = useUpdatePaymentStatus()

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
    <div>
      {Object.entries(paymentsByBill).map(([billTitle, billPayments]) => {
        return (
          <section key={billTitle} className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">{billTitle}</h2>
            <ul>
              {billPayments.map((payment) => (
                <li
                  key={payment.id}
                  className={`mb-1 rounded p-2 ${
                    payment.paid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <strong>{payment.flattieName}</strong>
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handlePaymentStatus(payment.id, !payment.paid)
                    }
                    className={`ml-4 rounded px-2 py-1 text-sm font-medium ${
                      payment.paid
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {payment.paid ? 'has' : "hasn't"}
                  </button>
                  paid ${payment.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {updateError && (
        <p className="mt-4 text-red-600">
          Error: {(updateError as Error).message}
        </p>
      )}
    </div>
  )
}
