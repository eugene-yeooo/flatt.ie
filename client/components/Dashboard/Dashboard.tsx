type Payment = {
  id: number
  flatmateName: string
  billTitle: string
  amount: number
  paid: boolean
  dueDate: Date
}

type DashboardProps = {
  payments: Payment[]
}

export default function Dashboard({ payments }: DashboardProps) {
  const paidPayments = payments.filter((p) => p.paid)
  const unpaidPayments = payments.filter((p) => !p.paid)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Unpaid Payments</h2>
        {unpaidPayments.length === 0 ? (
          <p>All payments are paid up!</p>
        ) : (
          <ul>
            {unpaidPayments.map((payment) => (
              <li
                key={payment.id}
                className="mb-3 rounded border bg-red-100 p-4 text-red-700"
              >
                <strong>{payment.flatmateName}</strong> owes $
                {payment.amount.toFixed(2)} for <em>{payment.billTitle}</em> due
                on {payment.dueDate.toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Paid Payments</h2>
        {paidPayments.length === 0 ? (
          <p>No payments have been made yet.</p>
        ) : (
          <ul>
            {paidPayments.map((payment) => (
              <li
                key={payment.id}
                className="mb-3 rounded border bg-green-100 p-4 text-green-700"
              >
                <strong>{payment.flatmateName}</strong> paid $
                {payment.amount.toFixed(2)} for <em>{payment.billTitle}</em>{' '}
                (due {payment.dueDate.toLocaleDateString()})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
