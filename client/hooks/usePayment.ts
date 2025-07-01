import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addPayments, deletePayment, getAllPayments } from '../apis/payments.ts'
import { updatePaymentStatus } from '../apis/payments.ts'
import { Payment } from 'models/models.ts'
import { payFromCredit } from '../apis/payments'

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

type AddPaymentsInput = {
  billId: number
  payments: Partial<Payment>[]
}

export function useAddPayments() {
  const queryClient = useQueryClient()

  return useMutation<Payment[], Error, AddPaymentsInput>({
    mutationFn: ({ billId, payments }) => addPayments(billId, payments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (error) => {
      console.error('Failed to add payments:', error.message)
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export function usePayFromCredit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (paymentId: number) => payFromCredit(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err) => {
      console.error('Failed to pay from credit:', err)
    },
  })
}
