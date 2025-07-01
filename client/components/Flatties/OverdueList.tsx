import { FlatmateWithData } from 'models/models'
import { useEffect, useState } from 'react'

interface OverdueFlattie {
  id: number
  name: string
  overdue: number
}

export default function OverdueList() {
  const [overdueList, setOverdueList] = useState<OverdueFlattie[]>([])

  useEffect(() => {
    fetch('/api/v1/flatties/data')
      .then((res) => res.json())
      .then((rawData) => {
        const data = rawData as FlatmateWithData[]
        const filtered = data.filter((f) => f.overdue > 0)
        setOverdueList(filtered)
      })
      .catch((err) => console.error('Failed to fetch overdue list:', err))
  }, [])

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
