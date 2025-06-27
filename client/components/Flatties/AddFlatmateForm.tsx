import React, { useState } from 'react'

interface Props {
  onAdd: (newMate: { name: string; credit: number; debt: number }) => void
}

export default function AddFlatmateForm({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [credit, setCredit] = useState('')
  const [debt, setDebt] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    onAdd({ name, credit: Number(credit), debt: Number(debt) })

    setName('')
    setCredit('')
    setDebt('')
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 mb-8'>
      <div>
        <label htmlFor="name" className='block text-sm font-medium'>Name</label>
        <input id='name' type="text" value={name} onChange={(e) => setName(e.target.value)}
          className='border px-3 py-2 rounded-md w-full' required />
      </div>

      <div>
        <label htmlFor="credit" className='block text-sm font-medium'>Credit</label>
        <input id='credit' type="number" value={credit} onChange={(e) => setCredit(e.target.value)}
          className='border px-3 py-2 rounded-md w-full' required />
      </div>

      <div>
        <label htmlFor="debt" className='block text-sm font-medium'>Debt</label>
        <input id='debt' type="number" value={debt} onChange={(e) => setDebt(e.target.value)}
          className='border px-3 py-2 rounded-md w-full' required />
      </div>

      <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600'>Add Flatmate</button>
    </form>
  )
}