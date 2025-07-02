import request from 'superagent'
import { User } from '../../models/models'

const rootURL = new URL('/api/v1', document.baseURI)

interface NewUser {
  username: string
  email: string
  avatar_url?: string
}

interface AddUser {
  newUser: NewUser
  token: string
}

// Get all users
export async function getAllUsers(token: string): Promise<User[] | null> {
  try {
    const res = await request
      .get(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
    return res.body || []
  } catch (err) {
    console.error('Error fetching all users:', err)
    return null
  }
}
// Post Credit Users
export async function updateCredit(credit: number, token: string) {
  try {
    const res = await request
      .patch(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({ credit })
    console.log('Updated credit:', res.body)
    return res.body || []
  } catch (err) {
    console.error('Error updating credit', err)
    return null
  }
}
// DELETE Users
export async function deleteUser(userId: number, token: string): Promise<void> {
  await request
    .delete(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
}

// Get current user
export async function getCurrentUser(token: string): Promise<User | null> {
  try {
    const res = await request
      .get(`${rootURL}/users/me`)
      .set('Authorization', `Bearer ${token}`)
    return res.body || null
  } catch (err) {
    console.error('Error fetching current user:', err)
    return null
  }
}

// Add new user
export async function addUser({
  newUser,
  token,
}: AddUser): Promise<User | null> {
  try {
    const res = await request
      .post(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newUser })
    return res.body || null
  } catch (err) {
    console.error('Error adding user:', err)
    return null
  }
}

export async function editProfile(
  formData: FormData,
  token: string,
): Promise<User | null> {
  try {
    const res = await request
      .patch(`${rootURL}/users/me`)
      .set('Authorization', `Bearer ${token}`)
      .send(formData)
    return res.body || null
  } catch (err) {
    console.error('Error adding user:', err)
    return null
  }
}
