import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/payment.ts'

const router = Router()

// GET /api/v1/payments
router.get('/', async (req, res) => {
  try {
    const payment = await db.getAllPayments()
    res.json(payment)
  } catch (err) {
    console.error('Error fetching all Payments', err)
    res.status(500).json({ error: 'Failed to load all payments' })
  }
})

export default router
