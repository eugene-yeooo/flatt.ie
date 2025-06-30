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
    const id = await db.addBill(req.body)
    res.status(201).json({ id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error adding new bill' })
  }
})

// DELETE /api/v1/bill/delete-bill
router.delete('/delete-bill/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const deletedCount = await db.deleteBill(id)
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Bill not found' })
    }
    res.status(200).json({ message: 'Bill deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error: failed to delete bill' })
  }
})

// PATCH /api/v1/bill/update-bill
router.patch('/update-bill', async (req, res) => {
  try {
    const data = req.body
    if (!data?.id) {
      return res.status(400).json({ message: 'Bill ID is required' })
    }
    await db.updateBill(data)
    res.status(200).json({ message: 'Bill updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error: failed to update bill' })
  }
})

export default router
