import { Payment } from 'models/models'
import '../../styles/main.css'
import { useDeletePayment } from '../../hooks/usePayment'
import { text } from 'express'

type PaymentCardProps = {
  billAmount: number
  billTitle: string
  billPayments: Payment[]
  isUpdating: boolean
  onTogglePaid: (id: number, paidStatus: boolean) => void
}

export default function PaymentCard({
  billTitle,
  billPayments,
  isUpdating,
  onTogglePaid,
}: PaymentCardProps) {
  const totalPaid = billPayments
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0)
  const deleteMutation = useDeletePayment()

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      deleteMutation.mutate(id)
    }
  }
  return (
    <section
      className="mb-10 rounded-xl p-4 shadow"
      style={{
        backgroundColor: 'var(--primary-foreground)',
      }}
    >
      <div className=" px-6 py-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
          {billTitle}
        </h2>
      </div>
      <ul>
        {billPayments.map((payment) => (
          <li
            key={payment.id}
            className={`flex items-center justify-between px-6 py-4 ${
              payment.paid
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="text-sm sm:text-base">
              <span className="font-semibold">{payment.flattieName}</span>{' '}
              {payment.paid ? 'has paid' : "hasn't paid"}{' '}
              <span className="font-bold">
                $
                {typeof payment.amount === 'number'
                  ? payment.amount.toFixed(2)
                  : '0.00'}
              </span>
            </div>
            {/* MARK UNPAID/PAID */}
            <div className="ml-auto flex items-center gap-2">
              <button
                disabled={isUpdating}
                onClick={() => onTogglePaid(payment.id, !payment.paid)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition ${
                  payment.paid
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {payment.paid ? 'Mark Unpaid' : 'Mark Paid'}
              </button>
              {/* Delete X */}
              <button
                disabled={isUpdating || deleteMutation.isPending}
                onClick={() => handleDelete(payment.id)}
                aria-label="Delete payment"
                className="rounded-full px-2 py-1.5 text-sm font-bold transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ color: 'var(--primary)' }}
              >
                x
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className=" px-6 py-4 text-right text-sm text-gray-600">
        <strong className="text-gray-800">
          Total Paid: ${totalPaid.toFixed(2)} of $
          {billPayments[0]?.billTotal?.toFixed(2) ?? '0.00'}
        </strong>
      </div>
    </section>
  )
}
