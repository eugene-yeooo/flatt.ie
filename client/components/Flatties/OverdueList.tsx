import { useEffect, useState } from 'react'
import { useAllUsers } from '../../hooks/useUser'
import { getAllPayments } from '../../apis/payments'

interface OverdueUsers {
  id: number
  name: string
  overdue: number
}

export default function OverdueList() {
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useAllUsers()
  const [overdueList, setOverdueList] = useState<OverdueUsers[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsError, setPaymentsError] = useState<Error | null>(null)

  useEffect(() => {
    async function calculateOverdue() {
      if (!users) return
      try {
        setPaymentsLoading(true)
        const payments = await getAllPayments()
        setPaymentsLoading(false)

        const today = new Date()

        const calculated = users.map((user) => {
          const overdue = payments
            .filter(
              (p) =>
                p.userId === user.id &&
                Number(p.paid) === 0 &&
                new Date(p.dueDate) < today,
            )
            .reduce((sum, p) => sum + p.amount, 0)

          return { id: user.id, name: user.name, overdue }
        })

        setOverdueList(calculated.filter((f) => f.overdue > 0))
      } catch (err) {
        setPaymentsLoading(false)
        setPaymentsError(err as Error)
        console.error('Failed to fetch payments or calculate overdue:', err)
      }
    }

    calculateOverdue()
  }, [users])

  if (usersLoading || paymentsLoading) return <p>Loading overdue payments...</p>
  if (usersError) return <p>Error loading users.</p>
  if (paymentsError) return <p>Error loading payments.</p>
  if (overdueList.length === 0) return null

  return (
    <div className="mx-auto mt-8 max-w-3xl px-4">
      <h2 className="mb-4 text-center text-2xl font-semibold text-orange-600">
        Overdue Payments
      </h2>
      <ul className="space-y-2">
        {overdueList.map((mate) => (
          <li
            key={mate.id}
            className="flex items-center justify-between rounded-md border p-3 shadow-sm"
          >
            <span className="text-lg font-medium">{mate.name}</span>
            <span className="font-semibold text-orange-600">
              ${mate.overdue.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
