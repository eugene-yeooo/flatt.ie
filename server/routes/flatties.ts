import express from 'express'
import * as db from '../db/flatmates' // example

const router = express.Router()

router.get('/', async (req,res) => {
  try {
  const flatmates = await db.getAllFlatmates()
  console.log('flatmates from DB:', flatmates)
  res.json(flatmates)
  } catch (error) {
    console.error('Error getting flatmates:', error)
    res.status(500).json({ error: 'Failed to get flatmates' })
  }
})

export default router