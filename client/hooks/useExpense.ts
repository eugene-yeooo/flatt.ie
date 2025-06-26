import { useQuery } from '@tanstack/react-query'
import { getAllExpenses } from '../apis/expenses.ts'

export function useAllExpense() {
  const query = useQuery({
    queryKey: ['expense'],
    queryFn: () => getAllExpenses(),
  })
  return {
    ...query,
  }
}
