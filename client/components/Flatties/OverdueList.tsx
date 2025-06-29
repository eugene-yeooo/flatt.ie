import { FlatmateWithData } from "models/models"
import { useEffect, useState } from "react"

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
    <div className="max-w-3xl mx-auto px-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-orange-600 text-center">Overdue Payments</h2>
      <ul className="space-y-2">
        {overdueList.map((mate) => (
          <li key={mate.id} className="flex justify-between items-center border p-3 rounded-md shadow-sm">
            <span className="text-lg font-medium">{mate.name}</span>
            <span className="text-orange-600 font-semibold">
              ${mate.overdue.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}