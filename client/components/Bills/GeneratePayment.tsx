import { useAddPayments } from '../../hooks/usePayment'
import { Payment } from 'models/models'
interface GeneratePaymentProps {
  billId: number
  payments: Partial<Payment>[]
}
export default function GeneratePayment({
  billId,
  payments,
}: GeneratePaymentProps) {
  const { mutate: addPayments, isPending, error } = useAddPayments()

  const handleClick = () => {
    if (!billId || payments.length == 0) return
    addPayments({ billId, payments })
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
      >
        Generate Payment
      </button>
      {error && (
        <p className="ml-2 text-sm text-red-600">{(error as Error).message}</p>
      )}
    </div>
  )
}
