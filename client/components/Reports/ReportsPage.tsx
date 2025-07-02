import Report from './Reports'
import { useBillsReport } from '../../hooks/useBills'
import { useUserReports } from '../../hooks/usePayment'

export default function ReportsPage() {
  const {
    data: billsData,
    isLoading: billsLoading,
    isError: billsError,
  } = useBillsReport()
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useUserReports()
  if (billsLoading || usersLoading) return <p>Loading charts...</p>
  if (billsError) return <p>Error loading bills data</p>
  if (usersError) return <p>Error loading users data</p>

  return (
    <>
      <Report data={billsData} title="Monthly Expenses by Category" />
      <Report data={usersData} title="Monthly Expenses by Flatmates" />
    </>
  )
}
