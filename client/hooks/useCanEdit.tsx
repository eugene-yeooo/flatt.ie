import { useUser } from './useUser'

export default function useCanEdit() {
  const user = useUser()
  return user?.data?.account_type === 'flat_financer'
}
