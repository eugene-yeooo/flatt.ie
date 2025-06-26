import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/payment.ts'

const router = Router()

// GET /api/v1/payment
router.get('/', async (req, res) => {
  try {
    const payment = await db.getAllPayments()
    res.json(payment)
  } catch (err) {
    console.error('Error fetching all Payments', err)
    res.status(500).json({ error: 'Failed to load all payments' })
  }
})

// PATCH /api/v1/payment
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { paid } = req.body

  if (typeof paid !== 'boolean') {
    return res.status(400).json({ error: 'Invalid or missing "paid" value' })
  }

  try {
    const updated = await db.updatePaymentStatus(id, paid)
    if (updated === 0) {
      return res.status(404).json({ error: 'Payment not found' })
    }

    res.status(200).json({ message: 'Payment status updated successfully' })
  } catch (err) {
    console.error('Error updating Payments', err)
    res.status(500).json({ error: 'Failed to update payment statys' })
  }
})

export default router
