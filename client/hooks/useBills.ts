import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addNewBill,
  deleteBill,
  getAllBills,
  getBillById,
  updateBill,
} from '../apis/bills'
import { NewBill, UpdateBillData } from 'models/models'

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
    enabled: !!id, // only run if id is truthy
  })
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

export function useUpdateBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateBillData) => updateBill(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bills'] })
    },
    onError: (err) => {
      console.error('Failed to update bill', err)
    },
  })
}
