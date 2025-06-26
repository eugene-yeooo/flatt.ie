import { useState } from 'react'
import { useAllPayment } from '../../hooks/usePayment'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid')
  const { data: payments = [], isLoading, isError } = useAllPayment()

  if (isLoading) return <p>Loading payments...</p>
  if (isError) return <p>Error loading payments.</p>

  const paidPayments = payments.filter((p) => p.paid)
  const unpaidPayments = payments.filter((p) => !p.paid)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Toggle Tabs */}
      <nav className="mb-6 flex space-x-4 pb-2">
        <button
          className="btn"
          style={{
            color:
              activeTab === 'unpaid'
                ? 'var(--primary)'
                : 'var(--muted-foreground)',
          }}
          onClick={() => setActiveTab('unpaid')}
        >
          Unpaid
        </button>
        <button
          className="btn"
          style={{
            color:
              activeTab === 'paid'
                ? 'var(--primary)'
                : 'var(--muted-foreground)',
          }}
          onClick={() => setActiveTab('paid')}
        >
          Paid
        </button>
      </nav>

      {/* Payment List */}
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
                  <strong>{payment.bill_id}</strong> paid $
                  {payment.amount.toFixed(2)} for <em>{payment.bill_id}</em>{' '}
                  (due {new Date(payment.bill_id).toLocaleDateString()})
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
                <strong>{payment.bill_id}</strong> paid $
                {payment.amount.toFixed(2)} for <em>{payment.bill_id}</em> (due{' '}
                {new Date(payment.bill_id).toLocaleDateString()})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
