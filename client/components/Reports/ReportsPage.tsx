import { useState } from 'react'
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

  const [showCategoryReport, setShowCategoryReport] = useState(true)

  if (billsLoading || usersLoading) return <p>Loading charts...</p>
  if (billsError) return <p>Error loading bills data</p>
  if (usersError) return <p>Error loading users data</p>

  return (
    <div>
      <div className="mb-4 flex justify-center gap-x-4 ">
        <button
          onClick={() => setShowCategoryReport(true)}
          disabled={showCategoryReport}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium shadow transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: showCategoryReport
              ? 'var(--primary)'
              : 'var(--background)',
            color: showCategoryReport
              ? 'var(--primary-foreground)'
              : 'var(--muted-foreground)',
          }}
        >
          By Category
        </button>
        <button
          onClick={() => setShowCategoryReport(false)}
          disabled={!showCategoryReport}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium shadow transition-all duration-200 hover:shadow-md"
          style={{
            backgroundColor: !showCategoryReport
              ? 'var(--primary)'
              : 'var(--background)',
            color: !showCategoryReport
              ? 'var(--primary-foreground)'
              : 'var(--muted-foreground)',
          }}
        >
          By Flatmates
        </button>
      </div>

      {showCategoryReport ? (
        <div className="bg-[var(--background)]">
          <Report data={billsData} title="Monthly Expenses by Category" />
        </div>
      ) : (
        <div className="bg-[var(--background)]">
          <Report data={usersData} title="Monthly Expenses by Flatmates" />
        </div>
      )}
    </div>
  )
}
