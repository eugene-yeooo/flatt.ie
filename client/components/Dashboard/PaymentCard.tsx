import { Payment } from 'models/models'
import '../../styles/main.css'

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

  return (
    <section className="mb-10 rounded-xl border border-primary bg-white p-4 shadow-md ring-1 ring-primary/10">
      <div className="border-b px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">{billTitle}</h2>
      </div>

      <ul className="divide-y">
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
          </li>
        ))}
      </ul>

      <div className="border-t px-6 py-4 text-right text-sm text-gray-600">
        <strong className="text-gray-800">
          Total Paid: ${totalPaid.toFixed(2)} of $
          {billPayments[0]?.billTotal?.toFixed(2) ?? '0.00'}
        </strong>
      </div>
    </section>
  )
}
