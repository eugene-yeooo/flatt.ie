import express from 'express'
import * as db from '../db/flatmates' // example
import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination: 'server/public/uploads',
  filename: (req, file, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  }
})

const upload = multer({ storage })

router.get('/', async (req, res) => {
  try {
    const flatmates = await db.getAllFlatmates()
    res.json(flatmates)
  } catch (error) {
    console.error('Error getting flatmates:', error)
    res.status(500).json({ error: 'Failed to get flatmates' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await db.deleteFlatmate(id)
    res.sendStatus(204)
  } catch (error) {
    console.error('Error deleting flatmate:', error)
    res.status(500).json({ error: 'Failed to delete flatmate' })
  }
})

router.get('/balance', async (req, res) => {
  try {
    const flatmatesWithData = await db.getFlatmatesWithData()
    res.json(flatmatesWithData)
  } catch (error) {
    console.error('Error getting flatmates with balance:', error)
    res.status(500).json({ error: 'Failed to get flatmates with balance' })
  }
})

router.get('/overdue', async (req, res) => {
  try {
    const flatmates = await db.getFlatmatesWithData()
    const overdueOnly = flatmates.filter((f) => f.overdue > 0)
    res.json(overdueOnly)
  } catch (error) {
    console.error('Error getting overdue flatmates:', error)
    res.status(500).json({ error: 'Failed to get overdue flatmates' })
  }
})

router.post('/', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { name, credit } = req.body
    const profilePhoto: string | undefined = req.file ? `/uploads/${req.file.filename}` : undefined

    const newFlatmate = await db.addFlatmate({ name, credit, profilePhoto })
    res.status(201).json(newFlatmate[0])
  } catch (error) {
    console.error('Error adding flatmate:', error)
    res.status(500).json({ error: 'Failed to add flatmate' })
  }
})

export default router
