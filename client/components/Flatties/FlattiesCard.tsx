interface FlattieCardProps {
  name: string
  credit: number
  debt: number
}

export default function FlattieCard({ name, credit, debt }: FlattieCardProps) {
  const balance = credit - debt
  const balanceColor =
    balance > 0
      ? 'text-green-600'
      : balance < 0
        ? 'text-red-600'
        : 'text-muted-foreground'

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="text-sm text-muted-foreground">
        Credit: ${credit.toFixed(2)}
      </div>
      <div className="text-sm text-muted-foreground">
        Debt: ${debt.toFixed(2)}
      </div>
      <div className={`mt-1 text-sm font-medium ${balanceColor}`}>
        Balance: ${balance.toFixed(2)}
      </div>
    </div>
  )
}
