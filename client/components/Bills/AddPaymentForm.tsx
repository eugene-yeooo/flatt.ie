import { useEffect, useState } from 'react'
import { useAddPayments } from '../../hooks/usePayment'
import { X } from 'lucide-react'

interface AddPaymentProps {
  billId: number
  onClose: () => void
}

interface Flatmate {
  id: number
  name: string
}

export default function AddPayment({ billId, onClose }: AddPaymentProps) {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const [flatmateId, setFlatmateId] = useState('')
  const [split, setSplit] = useState('')
  const [paid, setPaid] = useState(false)

  const mutation = useAddPayments()

  useEffect(() => {
    async function fetchFlatmates() {
      try {
        const res = await fetch('/api/v1/flatties')
        if (!res.ok) throw new Error('Failed to fetch flatmates')
        const data = await res.json()
        setFlatmates(data)
      } catch (error) {
        console.error('Failed to fetch flatmates:', error)
      }
    }
    fetchFlatmates()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!flatmateId || !split) {
      alert('Please fill in all fields')
      return
    }

    mutation.mutate({
      billId,
      payments: [
        {
          flatmate_id: Number(flatmateId),
          split: parseFloat(split),
          paid,
        },
      ],
    })

    // Close the form after submission
    onClose()

    // Optionally reset form
    setFlatmateId('')
    setSplit('')
    setPaid(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center rounded-md bg-white p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Payment</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black"
            aria-label="Close form"
          >
            <X />
          </button>
        </div>

        <label className="mb-2 block font-medium">
          Flatmate Name <span className="text-red-500">*</span>
          <select
            value={flatmateId}
            onChange={(e) => setFlatmateId(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="" disabled>
              Select a flatmate
            </option>
            {flatmates.map((flatmate) => (
              <option key={flatmate.id} value={flatmate.id}>
                {flatmate.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-2 block font-medium">
          Split (%) <span className="text-red-500">*</span>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={split}
            onChange={(e) => setSplit(e.target.value)}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mb-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={paid}
            onChange={(e) => setPaid(e.target.checked)}
          />
          <span>Paid</span>
        </label>

        <button
          type="submit"
          className="mt-2 rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white shadow transition hover:bg-orange-600"
        >
          Add Payment
        </button>
      </form>
    </div>
  )
}
