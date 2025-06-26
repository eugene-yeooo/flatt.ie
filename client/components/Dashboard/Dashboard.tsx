import { useAllPayment } from '../../hooks/usePayment'

export default function Dashboard() {
  const { data: payments = [], isLoading, isError } = useAllPayment()

  if (isLoading) return <p>Loading payments...</p>
  if (isError) return <p>Error loading payments.</p>

  const paymentsByBill = payments.reduce(
    (acc, payment) => {
      // Get bill title from current payment;
      const key = payment.billTitle || 'Unknown Bill'
      //if bill title hasnt been seen yet, create empty array for it
      if (!acc[key]) acc[key] = []
      // Add the current payment to the array for this bill title
      acc[key].push(payment)
      return acc
    },
    // Start with an empty object to group payments by bill title
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
                  <strong>{payment.flattieName}</strong>{' '}
                  {payment.paid ? 'has ' : "hasn't "}
                  paid ${payment.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
