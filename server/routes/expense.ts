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
// POST /api/v1/expense
router.post('/', async (req, res) => {
  try {
    const expense = await db.addExpense(req.body)
    res.status(201).json({ expense })
  } catch (error) {
    console.error('Error adding expense type:', error)
    res.status(500).json({ error: 'Failed to add expense type' })
  }
})

// DELETE /avi/v1/expense/:id

router.delete('/:id', async (req, res) => {
  const expenseId = Number(req.params.id)
  try {
    await db.deleteExpense(expenseId)
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete payment' })
  }
})

// PATCH /api/v1/expense/:id
router.patch('/:id', async (req, res) => {
  try {
    const data = req.body
    if (!data?.id) {
      return res.status(400).json({ message: 'Expense ID is required' })
    }
    await db.updateExpense(data)
    res.status(200).json({ message: 'Expense updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error: failed to update expense' })
  }
})
export default router
