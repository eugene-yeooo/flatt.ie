import { useQuery } from '@tanstack/react-query'
import { getAllPayments } from '../apis/payments.ts'

export function useAllPayment() {
  const query = useQuery({
    queryKey: ['payment'],
    queryFn: () => getAllPayments(),
  })
  return {
    ...query,
  }
}
