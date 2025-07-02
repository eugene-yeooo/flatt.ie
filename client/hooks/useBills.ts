import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addNewBill,
  deleteBill,
  getAllBills,
  getBillById,
  updateBill,
  updateBillAndPayments,
} from '../apis/bills'
import { NewBill, UpdateBillData, UpdateBillRequest } from 'models/models'
import React from 'react'

// ---------- GET BILLS ---------- //

export function useGetAllBills() {
  const query = useQuery({
    queryKey: ['bills'],
    queryFn: () => getAllBills(),
  })
  return {
    ...query,
  }
}

// ---------- GET SINGLE BILL ---------- //

export function useGetBillById(id: number | string) {
  return useQuery({
    queryKey: ['bill', id],
    queryFn: () => getBillById(id),
    enabled: false,
  })
}

// -------- BILLS FOR REPORTS ----- //
export function useBillsReport() {
  const { data: bills = [], ...rest } = useGetAllBills()

  // Transform bills to the chart format
  const data = React.useMemo(() => {
    const result: Record<string, number[]> = {}

    bills.forEach((bill) => {
      const monthIndex = new Date(bill.dueDate).getMonth()
      const category = bill.expenseCategory

      if (!result[category]) {
        result[category] = Array(12).fill(0)
      }
      result[category][monthIndex] += Number(bill.totalAmount)
    })

    return Object.entries(result).map(([category, monthlyAmounts]) => ({
      category,
      monthlyAmounts,
    }))
  }, [bills])

  return { data, ...rest }
}

// ---------- ADD BILL ---------- //

export function useAddNewBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: NewBill) => addNewBill(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (err) => {
      console.error('Failed to add new bill', err)
    },
  })
}

// ---------- DELETE BILL ---------- //

export function useDeleteBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBill(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (err) => {
      console.error('Failed to delete bill', err)
    },
  })
}

// ---------- UPDATE BILL ---------- //

export function useUpdateBillAndPayments() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBillRequest) => updateBillAndPayments(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
      qc.invalidateQueries({ queryKey: ['bill'] })
    },
    onError: (err) => {
      console.error('Failed to update bill', err)
    },
  })
}
