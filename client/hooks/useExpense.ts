import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllExpenses, addExpense } from '../apis/expenses.ts'
import { NewExpense } from 'models/models.ts'

export function useAllExpense() {
  const query = useQuery({
    queryKey: ['expense'],
    queryFn: () => getAllExpenses(),
  })
  return {
    ...query,
  }
}

export function useAddExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: NewExpense) => addExpense(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] })
    },
    onError: (err) => {
      console.error('Failed to add new expense', err)
    },
  })
}
