import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addNewBill, getAllBills } from '../apis/bills'
import { NewBill } from 'models/models'

export function useGetAllBills() {
  const query = useQuery({
    queryKey: ['bills'],
    queryFn: () => getAllBills(),
  })
  return {
    ...query,
  }
}

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
