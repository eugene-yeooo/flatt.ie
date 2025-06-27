import { Payment } from 'models/models'

type PaymentCardProps = {
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
  return (
    <section className="mb-8 rounded border ">
      <h2 className="mb-2 text-xl font-semibold">{billTitle}</h2>
      <ul className="grid grid-cols-1">
        {billPayments.map((payment) => (
          <li
            key={payment.id}
            className={`mb-1 rounded p-2 ${
              payment.paid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } flex items-center justify-between`}
          >
            <div>
              <strong>{payment.flattieName}</strong>{' '}
              {payment.paid ? 'has' : "hasn't"} paid $
              {payment.amount.toFixed(2)}
            </div>
            <button
              disabled={isUpdating}
              onClick={() => onTogglePaid(payment.id, !payment.paid)}
              className={`ml-4 rounded px-2 py-1 text-sm font-medium ${
                payment.paid
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {payment.paid ? 'Mark Unpaid' : 'Mark Paid'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
