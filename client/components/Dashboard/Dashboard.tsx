import { useState } from 'react'

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
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid')
  const paidPayments = payments.filter((p) => p.paid)
  const unpaidPayments = payments.filter((p) => !p.paid)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Navbar toggle */}
      <nav className="mb-6 flex space-x-4 pb-2">
        <button
          style={{
            color:
              activeTab === 'unpaid'
                ? 'var(--primary)'
                : 'var(--muted-foreground)',
          }}
          className="btn"
          onClick={() => setActiveTab('unpaid')}
        >
          Unpaid
        </button>
        <button
          style={{
            color:
              activeTab === 'paid'
                ? 'var(--primary)'
                : 'var(--muted-foreground)',
          }}
          className="btn"
          onClick={() => setActiveTab('paid')}
        >
          Paid
        </button>
      </nav>

      {/* Payments list */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {activeTab === 'unpaid' ? 'Unpaid Payments' : 'Paid Payments'}
        </h2>
        {activeTab === 'unpaid' ? (
          unpaidPayments.length === 0 ? (
            <p>All payments are paid up!</p>
          ) : (
            <ul>
              {unpaidPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="mb-3 rounded p-4"
                  style={{
                    backgroundColor: 'var(--destructive)',
                    color: 'var(--destructive-foreground, white)',
                  }}
                >
                  <strong>{payment.flatmateName}</strong> owes $
                  {payment.amount.toFixed(2)} for <em>{payment.billTitle}</em>{' '}
                  due on {payment.dueDate.toLocaleDateString()}
                </li>
              ))}
            </ul>
          )
        ) : paidPayments.length === 0 ? (
          <p>No payments have been made yet.</p>
        ) : (
          <ul>
            {paidPayments.map((payment) => (
              <li
                key={payment.id}
                className="mb-3 rounded border p-4"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
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
