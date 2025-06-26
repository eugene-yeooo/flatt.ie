import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/flattie.ts'

const router = Router()

// GET /api/v1/flattie
router.get('/', async (req, res) => {
  try {
    const flatties = await db.getAllFlatties()
    res.json(flatties)
  } catch (err) {
    console.error('Error fetching flatties', err)
    res.status(500).json({ error: 'Failed to load flatties' })
  }
})

export default router
