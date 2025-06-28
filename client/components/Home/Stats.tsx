type SummaryStatsProps = {
  uniqueFlatmates: number
  totalMonthlyExpenses: number
  totalOverdue: number
}

export default function SummaryStats({
  uniqueFlatmates,
  totalMonthlyExpenses,
  totalOverdue,
}: SummaryStatsProps) {
  const summaryItems = [
    {
      label: 'Flatmates',
      value: uniqueFlatmates,
      valueStyle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--primary)',
      },
      cardStyle: {
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 1px 3px rgba(0 0 0 / 0.1)',
        padding: '1.5rem',
        textAlign: 'center',
      },
    },
    {
      label: 'This Month Expenses',
      value: `$${totalMonthlyExpenses.toFixed(2)}`,
      valueStyle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--primary)',
      },
      cardStyle: {
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 1px 3px rgba(0 0 0 / 0.1)',
        padding: '1.5rem',
        textAlign: 'center',
      },
    },
    {
      label: 'Total Overdue Amount',
      value: `$${totalOverdue.toFixed(2)}`,
      valueStyle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--destructive)', // dark burnt color for overdue
      },
      cardStyle: {
        backgroundColor: 'var(--card)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 1px 3px rgba(0 0 0 / 0.1)',
        padding: '1.5rem',
        textAlign: 'center',
      },
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
      }}
    >
      {summaryItems.map(({ label, value, valueStyle, cardStyle }, idx) => (
        <div key={idx} style={cardStyle}>
          <p
            style={{
              fontWeight: '600',
              color: 'var(--card-foreground)',
              marginBottom: '0.75rem',
            }}
          >
            {label}
          </p>
          <p style={valueStyle}>{value}</p>
        </div>
      ))}
    </div>
  )
}
