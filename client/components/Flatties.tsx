import { useEffect, useState } from "react"

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

  // Fetch flatmates on mount
  useEffect(() => {
    async function fetchData() {
      try {
      const res = await fetch('/api/v1/flatties')
      const data = await res.json()
      setFlatmates(data)
      } catch (error) {
        console.error('Failed to fetch flatmates:', error)
      }
    }
    fetchData()
  }, [])

  // Add flatmate
  async function handleAddFlatmate(e: React.FormEvent) {
    e.preventDefault()
    try {
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
    } catch (error) {
      console.error('Failed to add flatmate:', error)
    }
  }

  // Delete flatmate
  async function handleDelete(id: number) {
    try {
      await fetch(`/api/v1/flatties/${id}`, { method: 'DELETE' })
      setFlatmates(flatmates.filter((mate) => mate.id !== id))
    } catch (err) {
      console.error('Failed to delete flatmate:', err)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flatmates</h1>
      <form onSubmit={handleAddFlatmate} className="space-y-4">
        <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input id="name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" required />
        </div>
        <div>
          <label htmlFor="credit" className="block text-sm font-medium text-gray-700">Credit</label>
        <input id="credit" type="number" value={credit} onChange={(e) => setCredit(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" required />
        </div>
        <div>
          <label htmlFor="debt" className="block text-sm font-medium text-gray-700">Debt</label>
        <input id="debt" type="number" value={debt} onChange={(e) => setDebt(e.target.value)}
         className="border px-3 py-2 rounded-md w-full" required />
        </div>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Add Flatmate</button>
      </form>

      <ul className="mt-8 space-y-4">
        {flatmates.map((mate) => (
          <li key={mate.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
            <p className="font-semibold">{mate.name}</p>
            <p>Credit: ${mate.credit}</p>
            <p>Debt: ${mate.debt}</p>
            <p className="font-medium">Balance: ${mate.credit - mate.debt}</p>
            </div>
            <button onClick={() => handleDelete(mate.id)} className="text-red-500 hover:underline text-sm">
              Delete
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}