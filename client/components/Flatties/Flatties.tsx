import { useState } from 'react'
import FlattieCard from './FlattiesCard'
// import AddFlatmateForm from './AddFlatmateForm'
// import { Dialog } from '@headlessui/react'
import { useAllUsers } from '../../hooks/useUser'

export default function Flatties() {
  // const [isOpen, setIsOpen] = useState(false)
  const { data: users, isLoading, isError } = useAllUsers()

  // function openModal() {
  //   setIsOpen(true)
  // }
  // function closeModal() {
  //   setIsOpen(false)
  // }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="mb-6 text-center text-3xl font-bold">Flatmates</h1>

      <div className="mb-4 text-center">
        <button
          // onClick={openModal}
          className="rounded bg-orange-400 px-4 py-2 font-semibold text-white hover:bg-orange-500"
        >
          + Add Flatmate
        </button>
      </div>

      {/* <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-xl font-semibold">
              Add New Flatmate
            </Dialog.Title>
            <FlatLink />
          </Dialog.Panel>
        </div>
      </Dialog> */}

      {isLoading && (
        <p className="text-center text-gray-500">Loading flatmates...</p>
      )}
      {isError && (
        <p className="text-center text-red-500">Failed to load flatmates.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users?.map((mate) => (
          <FlattieCard
            key={mate.id}
            id={mate.id}
            name={mate.name}
            credit={mate.credit}
            overdue={mate.debt}
            avatar_url={mate.avatar_url}
          />
        ))}
      </div>
    </div>
  )
}
