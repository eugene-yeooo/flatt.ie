import { useEffect, useState } from 'react'
import { useAddPayments } from '../../hooks/usePayment'
import { X } from 'lucide-react'

interface AddPaymentProps {
  billId: number
  totalAmount: number
  onClose: () => void
}

interface Flatmate {
  id: number
  name: string
}

export default function AddPayment({
  billId,
  totalAmount,
  onClose,
}: AddPaymentProps) {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([])
  const [shares, setShares] = useState([
    { flatmateId: '', split: '', paid: false },
  ])

  const mutation = useAddPayments()

  useEffect(() => {
    const fetchFlatmates = async () => {
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

  const handleShareChange = (
    index: number,
    field: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const updatedShares = [...shares]
    if (field === 'paid') {
      updatedShares[index][field] = (
        e as React.ChangeEvent<HTMLInputElement>
      ).target.checked
    } else {
      updatedShares[index][field] = e.target.value
    }
    setShares(updatedShares)
  }

  const handleAddShare = () => {
    setShares([...shares, { flatmateId: '', split: '', paid: false }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalSplit = shares.reduce(
      (sum, s) => sum + parseFloat(s.split || '0'),
      0,
    )
    if (totalSplit !== 100) {
      alert('Total split must equal 100%')
      return
    }

    if (shares.some((s) => !s.flatmateId || !s.split)) {
      alert('Please fill in all fields for each share')
      return
    }

    mutation.mutate({
      billId,
      payments: shares.map((s) => ({
        flatmate_id: Number(s.flatmateId),
        split: parseFloat(s.split) / 100,
        paid: s.paid,
        amount: (parseFloat(s.split) / 100) * totalAmount,
      })),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-[600px] flex-col justify-center rounded-md bg-white p-8 shadow-md"
      >
        <div className="mb-6 flex items-center justify-between">
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

        {shares.map((share, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <label className="mb-2 block font-medium">
              Flatmate
              <select
                value={share.flatmateId}
                onChange={(e) => handleShareChange(index, 'flatmateId', e)}
                required
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="" disabled>
                  Select a flatmate
                </option>
                {flatmates.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mb-2 block font-medium">
              Split (%) <span className="text-red-500">*</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={share.split}
                onChange={(e) => handleShareChange(index, 'split', e)}
                required
                placeholder="e.g. 25 for 25%"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="mb-2 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={share.paid}
                onChange={(e) => handleShareChange(index, 'paid', e)}
              />
              <span>Paid</span>
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddShare}
          className="mb-4 rounded bg-blue-100 px-3 py-1 text-sm text-blue-800"
        >
          + Add Flatmate Share
        </button>

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
