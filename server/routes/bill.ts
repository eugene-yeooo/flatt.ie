import express from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/bill.ts'

const router = express.Router()

// GET /api/v1/bill
router.get('/', async (req, res) => {
  try {
    const bills = await db.getAllBills()
    if (!bills) return res.status(404).json({ message: 'Bills not found' })

    res.json(bills)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bills' })
  }
})

// POST /api/v1/bill/add-bill
router.post('/add-bill', async (req, res) => {
  try {
    const billId = await db.addBill(req.body)
    res.status(201).json({ billId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error adding new bill' })
  }
})

export default router
