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
  const [credit, setCredit] = useState('')
  const [debt, setDebt] = useState('')

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
      body: JSON.stringify({ name: newName, credit: Number(credit), debt: Number(debt) }),
    })
    const newFlatmate = await res.json()
    setFlatmates([...flatmates, newFlatmate]) 
    setNewName('')
    setCredit('')
    setDebt('')
  }

  // Delete flatmate
  async function handleDelete(id: number) {
    try {
      await fetch('/api/v1/flatties/${id}', {
        method: 'DELETE',
      })
      setFlatmates(flatmates.filter((mate) => mate.id !== id))
    } catch (err) {
      console.error('Failed to delete flatmate:', err)
    }
  }

  return (
    <div>
      <h1>Flatmates</h1>
      <form onSubmit={handleAddFlatmate} className="mt-6 space-y-2">
        <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Credit</label>
        <input type="number" placeholder="Credit" value={credit} onChange={(e) => setCredit(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Debt</label>
        <input type="number" placeholder="Debt" value={debt} onChange={(e) => setDebt(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" />
        </div>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Add Flatmate</button>
      </form>

      <ul className="mt-8 space-y-4">
        {flatmates.map((mate) => (
          mate ? (
          <li key={mate.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
            <strong className="text-lg">{mate.name}</strong> <br />
            Credit: ${mate.credit} <br />
            Debt: ${mate.debt} <br />
            Balance: ${mate.credit - mate.debt}
            </div>
            <button onClick={() => handleDelete(mate.id)} className="text-red-500 hover:underline text-sm">
              Delete
            </button>
            </div>
          </li>
          ) : null

        ))}
      </div>
    </div>
  )
}
