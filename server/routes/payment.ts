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
    res.status(500).json({ error: 'Failed to update payment status' })
  }
})

router.patch('/:id/pay-from-credit', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const result = await db.payFromCredit(id)
    res.json(result)
  } catch (err: unknown) {
    const error = err as Error
    console.error('Pay from credit failed:', error)
    res.status(400).json({ error: error.message || 'Payment failed' })
  }
})

// POST /api/v1/payment
router.post('/', async (req, res) => {
  const { billId, payments } = req.body

  if (!billId || !Array.isArray(payments) || payments.length === 0) {
    return res.status(400).json({ error: 'Missing billId or payments array' })
  }
  const paymentsToInsert = payments.map((payment) => ({
    ...payment,
    user_id: payment.userId,
    bill_id: billId,
  }))

  try {
    const newPayments = await db.generatePayments(paymentsToInsert, billId)
    console.log(newPayments)
    res.status(200).json(newPayments)
  } catch (err) {
    console.error('Error creating payments', err)
    res.status(500).json({ error: 'Failed to create payments' })
  }
})

// Delete payment by id
router.delete('/:id', async (req, res) => {
  const paymentId = Number(req.params.id)
  try {
    await db.deletePaymentById(paymentId)
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete payment' })
  }
})

export default router
