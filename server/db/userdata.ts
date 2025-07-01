import connection from './connection'

interface User {
  auth0_id: string
  username: string
  email: string
  id: string
  name: string
  account_type: 'flat_financer' | 'flattie' | 'guest'
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
  account_type: 'flat_financer' | 'flattie' | 'guest'
  credit?: number
  debt?: number
  bio?: string
}

export async function getAllUsers(): Promise<User[]> {
  return await connection('users').select(
    'auth0_id',
    'id as user_id',
    'username',
    'email',
    'avatar_url',
    'name',
    'account_type',
    'credit',
    'debt',
    'bio',
  )
}

export async function getUserByAuth0Id(auth0_id: string): Promise<User | null> {
  const user = await connection('users')
    .select(
      'auth0_id',
      'id as user_id',
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

//updateUser:
export async function updateUser(
  user: NewUser,
  db = connection,
): Promise<User> {
  try {
    const [updatedUser] = await db('users')
      .where({ auth0_id: user.auth0_id })
      .update(
        {
          name: user.name,
          username: user.username,
          avatar_url: user.avatar_url,
          bio: user.bio,
          updated_at: new Date(),
        },
        [
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
        ],
      )

    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
