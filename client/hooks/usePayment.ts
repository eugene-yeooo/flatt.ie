import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllPayments } from '../apis/payments.ts'
import { updatePaymentStatus } from '../apis/payments.ts'

export function useAllPayment() {
  const query = useQuery({
    queryKey: ['payments'],
    queryFn: () => getAllPayments(),
  })
  return {
    ...query,
  }
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; paid: boolean }) =>
      updatePaymentStatus(params.id, params.paid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
