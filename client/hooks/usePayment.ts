import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addPayments,
  deletePayment,
  deletePaymentsByBillId,
  getAllPayments,
} from '../apis/payments.ts'
import { updatePaymentStatus } from '../apis/payments.ts'
import { Payment } from 'models/models.ts'
import { payFromCredit } from '../apis/payments'
import React from 'react'

export function useAllPayment() {
  const query = useQuery({
    queryKey: ['payments'],
    queryFn: () => getAllPayments(),
  })
  return {
    ...query,
  }
}
export function useUserReports() {
  const { data: payments = [], ...rest } = useAllPayment()

  const data = React.useMemo(() => {
    const result: Record<string, number[]> = {}

    payments.forEach((payment: Payment) => {
      const date =
        payment.dueDate instanceof Date
          ? payment.dueDate
          : new Date(payment.dueDate)
      const monthIndex = date.getMonth()
      const userName = payment.userName

      if (!result[userName]) {
        result[userName] = Array(12).fill(0)
      }

      result[userName][monthIndex] += payment.amount
    })

    return Object.entries(result).map(([category, monthlyAmounts]) => ({
      category,
      monthlyAmounts,
    }))
  }, [payments])

  return { data, ...rest }
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; paid: boolean }) =>
      updatePaymentStatus(params.id, params.paid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['bills'] })
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
      queryClient.invalidateQueries({ queryKey: ['flatties'] })
    },
    onError: (err) => {
      console.error('Failed to pay from credit:', err)
    },
  })
}

export function useDeletePaymentsByBillId() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePaymentsByBillId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
