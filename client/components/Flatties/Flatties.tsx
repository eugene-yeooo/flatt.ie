import { useEffect, useState } from 'react'
import FlattieCard from './FlattiesCard'
import AddFlatmateForm from './AddFlatmateForm'

interface Flatmate {
  id: number
  name: string
  credit: number
  debt: number
  profilePhoto?: string
  balance: number
  unpaid: number
}

export default function Flatties() {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])

  useEffect(() => {
    fetch('/api/v1/flatties/balance')
    .then((res) => res.json())
    .then((data) => setFlatmates(data))
    .catch((err) => console.error('Failed to fetch flatmates:', err))
  }, [])

  // Add flatmate
  async function handleAddFlatmate(newMate: { name: string; credit: number; debt: number }) {
    try {
    const res = await fetch('/api/v1/flatties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMate),
    })
    const created = await res.json()
    setFlatmates([...flatmates, {...created, balance: created.credit - created.debt, unpaid: 0 }]) 
    } catch (error) {
      console.error('Failed to add flatmate:', error)
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/v1/flatties/${id}`, {method: 'DELETE'})
      setFlatmates(flatmates.filter((mate) => mate.id !== id))
    } catch (err) {
      console.error('Failed to delete flatmate:', err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Flatmates</h1>
      <AddFlatmateForm onAdd={handleAddFlatmate} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flatmates.map((mate) => (
          <FlattieCard 
            key={mate.id}
            name={mate.name}
            credit={mate.credit}
            debt={mate.debt}
            unpaid={mate.unpaid}
            onDelete={() => handleDelete(mate.id)}
          />
        ))}
        </div>
      </div>
  )
}
