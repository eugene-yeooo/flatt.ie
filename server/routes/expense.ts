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

router.post('/', async (req, res) => {
  try {
    const expense = await db.addExpense(req.body)
    res.status(201).json({ expense })
  } catch (error) {
    console.error('Error adding expense type:', error)
    res.status(500).json({ error: 'Failed to add expense type' })
  }
})

export default router
