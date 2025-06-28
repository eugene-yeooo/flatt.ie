import { useAllPayment } from '../../hooks/usePayment'
import SummaryStats from './Stats'
import RecentBills from './Recents'

export default function Home() {
  const { data: payments = [], isLoading, isError } = useAllPayment()

  if (isLoading) return <p>Loading summary...</p>
  if (isError) return <p>Failed to load summary.</p>

  const uniqueFlatmates = new Set(payments.map((p) => p.flattieName)).size

  const today = new Date()
  const daysRange = 30
  const msInDay = 1000 * 60 * 60 * 24

  function parseDate(date: string | Date): Date {
    return date instanceof Date ? date : new Date(date)
  }

  const uniqueBills = new Map<
    string,
    { billTotal: number; latestId: number; dueDate: string | Date }
  >()

  payments.forEach((p) => {
    if (p.billTitle && typeof p.billTotal === 'number' && p.dueDate) {
      const due = parseDate(p.dueDate)
      const diffDays = (due.getTime() - today.getTime()) / msInDay
      if (diffDays >= -daysRange && diffDays <= daysRange) {
        const existing = uniqueBills.get(p.billTitle)
        if (!existing || p.id > existing.latestId) {
          uniqueBills.set(p.billTitle, {
            billTotal: p.billTotal,
            latestId: p.id,
            dueDate: p.dueDate,
          })
        }
      }
    }
  })

  const recentBills = Array.from(uniqueBills.entries())
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

  const totalMonthlyExpenses = Array.from(uniqueBills.values()).reduce(
    (sum, val) => sum + val.billTotal,
    0,
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Flat Expense Summary</h1>

      <SummaryStats
        uniqueFlatmates={uniqueFlatmates}
        totalMonthlyExpenses={totalMonthlyExpenses}
        totalOverdue={totalOverdue}
      />

      <RecentBills bills={billPaidUnpaid} />
    </div>
  )
}
