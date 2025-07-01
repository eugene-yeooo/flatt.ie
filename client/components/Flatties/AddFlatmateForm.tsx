import React, { useRef, useState } from 'react'

interface Props {
  onAdd: (foemData: FormData) => void
  onClose: () => void
}

export default function AddFlatmateForm({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [credit, setCredit] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const formData = new FormData()
    formData.append('name', name)
    formData.append('credit', credit)
    if (photo) {
      formData.append('profilePhoto', photo)
    }

    onAdd(formData)

    setName('')
    setCredit('')
    setPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
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
        <label htmlFor="profilePhoto" className='block text-sm font-medium'>Profile Photo</label>
        <input id='profilePhoto' type="file" accept='image/*' onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          ref={fileInputRef} className='border px-3 py-2 rounded-md w-full' />
      </div>

      <div className='mt-6 flex justify-end space-x-3'>
        <button type='button' onClick={onClose} className='text-gray-500 hover:text-black'>Cancel</button>
        <button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600'>Add Flatmate</button>
      </div>
    </form>
  )
}