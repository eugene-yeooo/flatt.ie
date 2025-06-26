import { useAllPayment } from '../../hooks/usePayment'

export default function Dashboard() {
  const { data: payments = [], isLoading, isError } = useAllPayment()

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
                  <strong>{payment.flattieName}</strong> paid $
                  {payment.amount.toFixed(2)} —{' '}
                  {payment.paid ? 'Paid' : 'Unpaid'}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
