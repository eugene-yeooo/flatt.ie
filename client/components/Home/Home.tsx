import { useAllPayment } from '../../hooks/usePayment'
import SummaryStats from './Stats'
import RecentBills from './Recents'

export default function Home() {
  const { data: payments = [], isLoading, isError } = useAllPayment()

  if (isLoading) return <p>Loading summary...</p>
  if (isError) return <p>Failed to load summary.</p>

  //count num of flatities by flattiename for each payment
  const numOfFlatties = new Set(payments.map((p) => p.flattieName)).size

  //date related constants
  const today = new Date()
  const daysRange = 30
  const msInDay = 1000 * 60 * 60 * 24

  //ensure all dates are parsed as date objects
  function parseDate(date: string | Date): Date {
    return date instanceof Date ? date : new Date(date)
  }

  //store most recent bill entry by IDfor each billTitle within date range
  const recentBillMap = new Map<
    string,
    { billTotal: number; latestId: number; dueDate: string | Date }
  >()

  //loop for payments
  payments.forEach((p) => {
    //ensure valid data
    if (p.billTitle && typeof p.billTotal === 'number' && p.dueDate) {
      const due = parseDate(p.dueDate)
      //calculate number of days between due date and today
      const diffDays = (due.getTime() - today.getTime()) / msInDay
      //only include bills within +/- 30 days of today
      if (diffDays >= -daysRange && diffDays <= daysRange) {
        const existing = recentBillMap.get(p.billTitle)
        //if no existing bill OR current bill has newer ID, update more recent versions to map
        if (!existing || p.id > existing.latestId) {
          recentBillMap.set(p.billTitle, {
            billTotal: p.billTotal,
            latestId: p.id,
            dueDate: p.dueDate,
          })
        }
      }
    }
  })

  //convert recentBillMap to array, sort by latest ID (newest first), take top 5
  const recentBills = Array.from(recentBillMap.entries())
    .sort((a, b) => b[1].latestId - a[1].latestId)
    .slice(0, 5)

  const billPaidUnpaid = recentBills.map(([billTitle, info]) => {
    const paymentsForBill = payments.filter((p) => p.billTitle === billTitle)
    const paid = paymentsForBill
      .filter((p) => p.paid)
      .reduce((sum, p) => sum + p.amount, 0)
    const billTotal = paymentsForBill[0]?.billTotal ?? 0
    const dueDate = info.dueDate
    return { billTitle, billTotal, paid, dueDate }
  })

  const totalOverdue = payments
    .filter((p) => !p.paid && new Date(p.dueDate) < today)
    .reduce((sum, p) => sum + p.amount, 0)

  const totalMonthlyExpenses = Array.from(recentBillMap.values()).reduce(
    (sum, val) => sum + val.billTotal,
    0,
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Flat Expense Summary</h1>

      <SummaryStats
        uniqueFlatmates={numOfFlatties}
        totalMonthlyExpenses={totalMonthlyExpenses}
        totalOverdue={totalOverdue}
      />

      <RecentBills bills={billPaidUnpaid} />
    </div>
  )
}
