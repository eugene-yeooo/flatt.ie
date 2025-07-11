import express from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import {
  addUser,
  deleteUserById,
  getAllUsers,
  getUserByAuth0Id,
  updateUser,
  updateUserCredit,
} from 'server/db/userdata.ts'

import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (
    req,
    file,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

const upload = multer({ storage })

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

//Patch
router.patch('/', async (req, res) => {
  try {
    const { credit, id } = req.body

    if (!id || typeof credit !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid credit value' })
    }

    const updatedUser = await updateUserCredit(id, credit)

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(updatedUser)
  } catch (err) {
    console.error('Error updating credit:', err)
    res.status(500).json({ error: 'Failed to update credit' })
  }
})

// DELETE /users/:id
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const userId = Number(req.params.id)
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' })

    const deleted = await deleteUserById(userId)
    if (deleted === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(204).end() // No content
  } catch (err) {
    console.error('Error deleting user:', err)
    res.status(500).json({ error: 'Failed to delete user' })
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

router.patch(
  '/me',
  checkJwt,
  upload.single('avatar_url'),
  async (req: JwtRequest, res) => {
    try {
      const auth0_id = req.auth?.sub
      const updates = req.body
      const avatar_url: string | undefined = req.file
        ? `/public/images/${req.file.filename}`
        : undefined

      if (!auth0_id) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const updatedUser = await updateUser({
        ...updates,
        auth0_id,
        avatar_url,
      })
      console.log('req.file:', req.file)
      console.log('req.body:', req.body)

      res.json(updatedUser)
    } catch (err) {
      console.error('Error updating user:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
)

export default router
