import type { Payment } from '../../models/models'

type PaymentCardProps = {
  payment: Payment
  isUpdating: boolean
  onTogglePaid: (id: number, paidStatus: boolean) => void
}

export default funciton PaymentCard({
return(
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
              ))})




})