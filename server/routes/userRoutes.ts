import express from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { addUser, getAllUsers, getUserByAuth0Id } from 'server/db/userdata.ts'

const router = express.Router()

// ---------- /users ----------

//GET /users route to list all users

router.get('/', async (_req, res) => {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (err) {
    console.log('error fetching users', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//POST /users route to register new user

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0_id = req.auth?.sub
    const { newUser } = req.body

    if (!newUser || !auth0_id || !newUser.username || !newUser.email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const userToInsert = { ...newUser, auth0_id }

    const user = await addUser(userToInsert)
    //return the newly created user in the response with 201
    res.status(201).json(user)
  } catch (err) {
    //handle error
    console.log('Error adding user:', err)
    res.status(500).json({ error: 'Failed to add user' })
  }
})

// ---------- /users/me ----------

//get users/me route for current authenticated user

router.get('/me', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0_id = req.auth?.sub
    if (!auth0_id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const user = await getUserByAuth0Id(auth0_id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.log('err fetching user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
