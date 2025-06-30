import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from '../apis/expenses.ts'
import { Expense, NewExpense } from 'models/models.ts'

// ---------- GET EXPENSE ---------- //
export function useAllExpense() {
  const query = useQuery({
    queryKey: ['expense'],
    queryFn: () => getAllExpenses(),
  })
  return {
    ...query,
  }
}

// ---------- ADD EXPENSE ---------- //
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

// ---------- DELETE EXPENSE ---------- //

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] })
    },
    onError: (err) => {
      console.error('Failed to delete expense', err)
    },
  })
}

// ---------- UPDATE EXPENSE ---------- //

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Expense) => updateExpense(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['expense'] })
    },
    onError: (err) => {
      console.error('Failed to update bill', err)
    },
  })
}
