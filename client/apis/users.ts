import { User } from '@auth0/auth0-react' // adjust import based on your types
import request from 'superagent'
import { User, UserData } from '../../models/users.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

interface AddUser {
  newUser: UserData
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
    return await request
      .post(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
  } catch (err) {
    console.error('Error adding user:', err)
    return null
  }
}
