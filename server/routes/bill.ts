import express from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/bill.ts'

const router = express.Router()

// GET /api/v1/bills
router.get('/', async (req, res) => {
  try {
    const bills = await db.getAllBills()
    if (!bills) return res.status(404).json({ message: 'Bills not found' })

    res.json(bills)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bills' })
  }
})

export default router
