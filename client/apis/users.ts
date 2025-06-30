import request from 'superagent'
import { User } from '../../models/models'

const rootURL = new URL(`/api/v1`, document.baseURI)

interface NewUser {
  username: string
  email: string
  avatar_url?: string
}

interface AddUser {
  newUser: NewUser
  token: string
}

// ------- VIEW USERS ------

//-------/users
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

//-------/users/me
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

// ------- Register user ------
export async function addUser({
  newUser,
  token,
}: AddUser): Promise<User | null> {
  try {
    const res = await request
      .post(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
    return res.body.user || null
  } catch (err) {
    console.error('Error adding user:', err)
    return null
  }
}
