type BillInfo = {
  billTitle: string
  billTotal: number
  paid: number
  dueDate: string | Date
}

type RecentBillsListProps = {
  bills: BillInfo[]
}

export default function RecentBills({ bills }: RecentBillsListProps) {
  const today = new Date()

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold text-primary">
        Current & Upcoming Bills
      </h2>
      <div className="space-y-3">
        {bills.map(({ billTitle, billTotal, paid, dueDate }) => {
          const isPaid = paid >= billTotal
          const due = new Date(dueDate)

          let statusText = ''
          let statusClass = ''

          if (isPaid) {
            statusText = 'Paid'
            statusClass = 'text-green-700' // Consider using your --accent or --primary if you want to customize
          } else if (due < today) {
            statusText = 'Overdue'
            statusClass = 'text-red-500'
          } else {
            statusText = 'Upcoming'
            statusClass = 'text-orange-500' // your --secondary var, again, replace as needed
          }

          return (
            <div
              key={billTitle}
              className="flex justify-between rounded-md bg-card p-3 shadow"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="text-lg font-semibold text-foreground">
                {billTitle}
              </div>
              <div className={`text-sm font-semibold ${statusClass}`}>
                {statusText}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
