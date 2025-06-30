import connection from './connection'

interface User {
  auth0_id: string
  username: string
  email: string
  id: string
  name: string
  account_type: 'finance_manager' | 'flattie' | 'guest'
  credit?: number
  debt?: number
  bio?: string
}

export interface NewUser {
  auth0_id: string
  username: string
  email: string
  avatar_url?: string
  name: string
  account_type: 'finance_manager' | 'flattie' | 'guest'
  credit?: number
  debt?: number
  bio?: string
}

export async function getAllUsers(): Promise<User[]> {
  return await connection('users').select(
    'auth0_id',
    'users.id as user_id',
    'username',
    'email',
    'avatar_url',
    'name',
    'account_type',
    'active',
  )
}

export async function getUserByAuth0Id(auth0_id: string): Promise<User | null> {
  const user = await connection('users')
    .select(
      'auth0_id',
      'user_id',
      'username',
      'email',
      'avatar_url',
      'name',
      'account_type',
      'credit',
      'debt',
      'bio',
    )
    .where('auth0_id', auth0_id)
    .first()

  return user || null
}

//addUser:
export async function addUser(user: NewUser, db = connection): Promise<User> {
  try {
    const existingUser = await db('users')
      .where({ auth0_id: user.auth0_id })
      .first()
    if (existingUser) return existingUser

    const [newUser] = await db('users')
      .insert(user)
      .returning([
        'id',
        'auth0_id',
        'username',
        'email',
        'avatar_url',
        'name',
        'account_type',
        'credit',
        'debt',
        'bio',
        'created_at',
        'updated_at',
      ])

    return newUser
  } catch (error) {
    console.error('Error adding user:', error)
    throw error
  }
}
