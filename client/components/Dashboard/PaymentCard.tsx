import { Payment, User } from 'models/models'
import '../../styles/main.css'
import { useDeletePayment } from '../../hooks/usePayment'
import confetti from 'canvas-confetti'
import { animate } from 'animejs'
import useCanEdit from '../../hooks/useCanEdit'
import useSound from 'use-sound'
import cashRegisterSfx from '../../../src/audio/cash-resgister.mp3'
import { useState } from 'react'

const useCashSound = () => {
  const [play] = useSound(cashRegisterSfx, {
    volume: 1,
    interrupt: true,
  })
  return play
}

function fireConfettiFromElement(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
  })
}

export function fireSadRain() {
  for (let i = 0; i < 15; i++) {
    const emoji = document.createElement('div')
    emoji.textContent = '🙃'
    emoji.style.position = 'fixed'
    emoji.style.left = `${Math.random() * 100}vw`
    emoji.style.top = `-80px`
    emoji.style.fontSize = `${24 + Math.random() * 40}px`
    emoji.style.pointerEvents = 'none'
    emoji.style.zIndex = '9999'
    emoji.style.opacity = '0'

    document.body.appendChild(emoji)

    animate(emoji, {
      top: '100vh',
      opacity: [0.5, 1],
      duration: 3000,
      delay: i * 100,
      easing: 'easeOutQuad',
    })
  }
}

export function fireMoney() {
  for (let i = 0; i < 15; i++) {
    const emoji = document.createElement('div')
    emoji.textContent = '💸'
    emoji.style.position = 'fixed'
    emoji.style.left = `${Math.random() * 100}vw`
    emoji.style.top = `-80px`
    emoji.style.fontSize = `${24 + Math.random() * 40}px`
    emoji.style.pointerEvents = 'none'
    emoji.style.zIndex = '9999'
    emoji.style.opacity = '0'

    document.body.appendChild(emoji)

    animate(emoji, {
      top: '100vh',
      opacity: [0.5, 1],
      duration: 3000,
      delay: i * 100,
      easing: 'easeOutQuad',
    })
  }
}

type PaymentCardProps = {
  billAmount: number
  billTitle: string
  billPayments: Payment[]
  isUpdating: boolean
  billDueDate: string | Date
  flatmates: User[]

  onTogglePaid: (id: number, paidStatus: boolean) => void
}

export default function PaymentCard({
  billTitle,
  billPayments,
  isUpdating,
  billDueDate,
  onTogglePaid,
}: PaymentCardProps) {
  const totalPaid = billPayments
    .filter((payment) => payment.paid)
    .reduce((sum, payment) => sum + payment.amount, 0)
  const deleteMutation = useDeletePayment()
  const canEdit = useCanEdit()
  const playCashSound = useCashSound()
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const getDaysOverdue = (dueDate: string | Date): number => {
    const due =
      typeof dueDate === 'string'
        ? new Date(`${dueDate}T23:59:59`)
        : new Date(dueDate)
    const now = new Date()
    const diffTime = now.getTime() - due.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const getDaysUntilDue = (dueDate: string | Date): number => {
    const due =
      typeof dueDate === 'string'
        ? new Date(`${dueDate}T23:59:59`)
        : new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }
  const isOverdue = (dueDate: string | Date | undefined, paid: boolean) => {
    if (!dueDate || paid) return false
    const due = dueDate instanceof Date ? dueDate : new Date(dueDate)
    return due < new Date()
  }
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      deleteMutation.mutate(id)
    }
  }
  const isBillPaid = totalPaid >= (billPayments[0]?.billTotal ?? 0)

  return (
    <section
      className="relative mb-10 rounded-xl p-4 shadow transition-colors"
      style={{
        backgroundColor: isBillPaid ? '#f0fdf4 ' : 'var(--primary-foreground)', // '#dcfce7' is Tailwind's green-50 hex
      }}
    >
      {isBillPaid && (
        <button
          onClick={() => setVisible(false)}
          aria-label="Hide card"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
      <div className="px-6 py-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: isBillPaid ? '#166534' : 'var(--primary)' }}
        >
          {billTitle}
        </h2>
      </div>

      <ul>
        {billPayments.map((payment) => (
          <li
            key={payment.id}
            className={`flex items-center justify-between px-6 py-4 ${
              payment.paid
                ? 'rounded bg-green-50 text-green-800'
                : 'rounded bg-red-50 text-red-800'
            }`}
          >
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-2 sm:text-base">
              <span className="font-semibold">{payment.userName}</span>
              <span>{payment.paid ? 'has paid' : "hasn't paid"}</span>
              <span className="font-bold">
                ${payment.amount?.toFixed(2) ?? '0.00'}
              </span>
            </div>
            {/* MARK UNPAID/PAID */}
            {canEdit && (
              <div className="ml-auto flex items-center gap-2">
                {!payment.paid && isOverdue(billDueDate, payment.paid) && (
                  <span className="ml-2 rounded-lg bg-red-300 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                    {getDaysOverdue(billDueDate)} day
                    {getDaysOverdue(billDueDate) !== 1 ? 's' : ''} overdue
                  </span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  {!payment.paid && !isOverdue(billDueDate, payment.paid) && (
                    <span className="rounded-lg bg-green-300 px-3 py-1.5 text-xs font-semibold text-green-900 shadow-sm">
                      Due in {getDaysUntilDue(billDueDate)} day
                      {getDaysUntilDue(billDueDate) !== 1 ? 's' : ''}
                    </span>
                  )}
                  {/* Other buttons like Mark Paid/Unpaid, Delete */}
                </div>
                <button
                  disabled={isUpdating}
                  onClick={(e) => {
                    onTogglePaid(payment.id, !payment.paid)
                    if (payment.paid) {
                      fireSadRain()
                    } else {
                      fireConfettiFromElement(e.currentTarget)
                      fireMoney()
                      playCashSound()
                    }
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition ${
                    payment.paid
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {payment.paid ? 'Mark Unpaid' : 'Mark Paid'}
                </button>
                {/* Delete X */}
                <button
                  disabled={isUpdating || deleteMutation.isPending}
                  onClick={() => handleDelete(payment.id)}
                  aria-label="Delete payment"
                  className="rounded-full px-2 py-1.5 text-sm font-bold transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ color: 'var(--primary)' }}
                >
                  x
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="px-6 py-4 text-right text-sm text-gray-600">
        {totalPaid >= (billPayments[0]?.billTotal ?? 0) ? (
          <strong className="font-semibold text-green-700">
            Bill of ${billPayments[0]?.billTotal?.toFixed(2) ?? '0.00'} Paid!
          </strong>
        ) : (
          <strong className="text-gray-800">
            Total Paid: ${totalPaid.toFixed(2)} of $
            {billPayments[0]?.billTotal?.toFixed(2) ?? '0.00'}
          </strong>
        )}
      </div>
      <div
        id="sad-rain-container"
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      ></div>
    </section>
  )
}
