import express from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { Jwt } from 'jsonwebtoken'
import { getUserWithProfileByAuth0Id } from 'server/db/userdata.ts'
import { getAllUsersWithProfiles } from 'server/db/userdata.ts'

const router = express.Router()

// ---------- /users ----------

//get /users route to list all users

router.get('/users', async (_req, res) => {
  try {
    const users = await getAllUsersWithProfiles()
    res.json(users)
  } catch (err) {
    console.log('error fetching users', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ---------- /users/me ----------

//get users/me route for current authenticated user

router.get('/users/me', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0_id = req.auth?.sub
    if (!auth0_id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await getUserWithProfileByAuth0Id(auth0_id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.log('err fetching user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
