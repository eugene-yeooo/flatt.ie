import express from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import {
  getUserWithProfileByAuth0Id,
  getAllUsersWithProfiles,
  addUser,
} from 'server/db/userdata.ts'

const router = express.Router()

// ---------- /users ----------

//GET /users route to list all users

router.get('/', async (_req, res) => {
  try {
    const users = await getAllUsersWithProfiles()
    res.json(users)
  } catch (err) {
    console.log('error fetching users', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

//POST /users route to register new user

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    //extract the auth0 userId from jwt token
    const auth0_id = req.auth?.sub
    //extract additional user data from the req body
    const { username, email } = req.body

    //check if required fields are present
    if (!auth0_id || !username || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    //call db function to insert the new user
    const user = await addUser({
      auth0_id,
      username,
      email,
    })
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
    const user = await getUserWithProfileByAuth0Id(auth0_id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.log('err fetching user:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
