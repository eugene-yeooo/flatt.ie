import { useEffect, useState } from 'react'
import FlattieCard from './FlattiesCard'
import AddFlatmateForm from './AddFlatmateForm'
import { FlatmateWithData } from 'models/models'
import { Dialog } from '@headlessui/react'

export default function Flatties() {
  const [flatmates, setFlatmates] = useState<FlatmateWithData[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchFlatmates()
  }, [])

  async function fetchFlatmates() {
    try {
      const res = await fetch('/api/v1/flatties/balance')
      const data = await res.json()
      setFlatmates(data)
    } catch (err) {
      console.error('Failed to fetch flatmates:', err)
    }
  }

  // Add flatmate
  async function handleAddFlatmate(formData: FormData) {
    try {
    await fetch('/api/v1/flatties', {
      method: 'POST',
      body: formData,
    })
    fetchFlatmates()
    setIsOpen(false)
    } catch (error) {
      console.error('Failed to add flatmate:', error)
    }
  }

  // Delete flatmate
  async function handleDelete(id: number) {
    try {
      await fetch(`/api/v1/flatties/${id}`, {method: 'DELETE'})
      setFlatmates(flatmates.filter((mate) => mate.id !== id))
    } catch (err) {
      console.error('Failed to delete flatmate:', err)
    }
  }

  // Update flatmate
  async function handleUpdate(id: number, updatedData: { name: string; credit: number; profilePhoto?: File | null}) {
    const formData = new FormData()
    formData.append('name', updatedData.name)
    formData.append('credit', String(updatedData.credit))
    if (updatedData.profilePhoto) {
      formData.append('profilePhoto', updatedData.profilePhoto)
    }
    try {
    await fetch(`/api/v1/flatties/${id}`, {
      method: 'PATCH',
      body: formData,
    })
    fetchFlatmates()
  } catch (err) {
    console.error('Failed to update flatmate:', err)
  }}

  function openModal() {
    setIsOpen(true)
  }
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Flatmates</h1>
      <div className='text-center mb-4'>
        <button onClick={openModal} className='bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded'>+ Add Flatmate</button>
      </div>
      <Dialog open={isOpen} onClose={closeModal} className='relative z-50'>
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel className='w-full max-w-md rounded bg-white p-6 shadow-lg'>
          <Dialog.Title className='text-xl font-semibold mb-4'>Add New Flatmate</Dialog.Title>
          <AddFlatmateForm onAdd={handleAddFlatmate} onClose={closeModal} />
          </Dialog.Panel>
        </div>
      </Dialog>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flatmates.map((mate) => (
          <FlattieCard 
            key={mate.id}
            id={mate.id}
            name={mate.name}
            credit={mate.credit}
            overdue={mate.overdue}
            profilePhoto={mate.profilePhoto}
            onDelete={() => handleDelete(mate.id)}
            onUpdate={handleUpdate}
          />
        ))}
        </div>
      </div>
  )
}
