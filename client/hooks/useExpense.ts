import { useQuery } from '@tanstack/react-query'
import { getAllExpenses } from '../apis/expenses.ts'

export function useExpense() {
  const query = useQuery({
    queryKey: ['expense'],
    queryFn: () => getAllExpenses(),
  })
  return {
    ...query,
  }
}
