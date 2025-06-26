import { useQuery } from '@tanstack/react-query'
import { getAllBills } from '../apis/bills'

export function useGetAllBills() {
  const query = useQuery({
    queryKey: ['bills'],
    queryFn: () => getAllBills(),
  })
  return {
    ...query,
  }
}
