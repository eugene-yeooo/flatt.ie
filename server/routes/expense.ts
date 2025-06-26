import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/expense.ts'

const router = Router()

// GET /api/v1/expense
router.get('/', async (req, res) => {
  try {
    const expense = await db.getAllExpenses()
    res.json(expense)
  } catch (err) {
    console.error('Error fetching all Expenses', err)
    res.status(500).json({ error: 'Failed to load all expenses' })
  }
})

export default router
