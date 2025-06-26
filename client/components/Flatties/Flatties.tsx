import { useEffect, useState } from 'react'
import FlattieCard from './FlattiesCard'

interface Flatmate {
  id: number
  name: string
  credit: number
  debt: number
}

export default function Flatties() {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const [newName, setNewName] = useState('')
  const [credit, setCredit] = useState(0)
  const [debt, setDebt] = useState(0)

  // Fetch flatmates on page load
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/v1/flatties')
      const data = await res.json()
      console.log('Fetched flatmates:', data)
      setFlatmates(data)
    }
    fetchData()
  }, [])

  // Handle form submission to add a flatmate
  async function handleAddFlatmate(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/v1/flatties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, credit, debt }),
    })
    const newFlatmate = await res.json()
    setFlatmates([...flatmates, newFlatmate[0]]) // assuming array is returned?
    setNewName('')
    setCredit(0)
    setDebt(0)
  }

  return (
    <div>
      <h1>Flatmates</h1>
      <form onSubmit={handleAddFlatmate}>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Credit"
          value={credit}
          onChange={(e) => setCredit(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Debt"
          value={debt}
          onChange={(e) => setDebt(Number(e.target.value))}
        />
        <button type="submit">Add Flatmate</button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flatmates.map((mate) => (
          <FlattieCard
            key={mate.id}
            name={mate.name}
            credit={mate.credit}
            debt={mate.debt}
          />
        ))}
      </div>
    </div>
  )
}
