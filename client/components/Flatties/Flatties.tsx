import { useEffect, useState } from 'react'
import FlattieCard from './FlattiesCard'
import AddFlatmateForm from './AddFlatmateForm'
import { FlatmateWithData } from 'models/models'

export default function Flatties() {
  const [flatmates, setFlatmates] = useState<FlatmateWithData[]>([])

  useEffect(() => {
    fetch('/api/v1/flatties/balance')
      .then((res) => res.json())
      .then((data) => setFlatmates(data))
      .catch((err) => console.error('Failed to fetch flatmates:', err))
  }, [])

  // Add flatmate
  async function handleAddFlatmate(formData: FormData) {
    try {
      await fetch('/api/v1/flatties', {
        method: 'POST',
        body: formData,
      })
      const updated = await fetch('/api/v1/flatties/balance')
      const data = await updated.json()
      setFlatmates(data)
    } catch (error) {
      console.error('Failed to add flatmate:', error)
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetch(`/api/v1/flatties/${id}`, { method: 'DELETE' })
      setFlatmates(flatmates.filter((mate) => mate.id !== id))
    } catch (err) {
      console.error('Failed to delete flatmate:', err)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Flatmates</h1>
      <AddFlatmateForm onAdd={handleAddFlatmate} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {flatmates.map((mate) => (
          <FlattieCard
            key={mate.id}
            name={mate.name}
            credit={mate.credit}
            overdue={mate.overdue}
            profilePhoto={mate.profilePhoto}
            onDelete={() => handleDelete(mate.id)}
          />
        ))}
      </div>
    </div>
  )
}
