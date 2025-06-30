import connection from './connection'

interface User {
  auth0_id: string
  username: string
  email: string
  id: string
  name: string
  account_type: string
  active: boolean
}

export async function getAllUsers(): Promise<User[]> {
  await connection('users').select(
    'auth0_id',
    'users.id as user_id',
    'users.username',
    'users.email',
    'users.avatar_url',
    'name',
    'account_type',
    'active',
  )
}

export async function getUserByAuth0Id(
  auth0_id: string,
  db = connection,
): Promise<User | undefined> {
  const rows = await db('users')
    .leftJoin('profiles', 'users.id', 'profiles.user_id')
    .select(
      'id as user_id',
      'auth0_id',
      'email',
      'username',
      'avatar_url',
      'id as profile_id',
      'profiles.profile_name',
      'profiles.account_type',
      'profiles.active',
    )
    .where('users.auth0_id', auth0_id)

  if (rows.length === 0) return undefined

  const user: UserWithProfiles = {
    id: rows[0].user_id,
    username: rows[0].username,
    email: rows[0].email,
    profiles: [],
  }

  rows.forEach((row) => {
    if (row.profile_id) {
      user.profiles.push({
        id: row.profile_id,
        profile_name: row.profile_name,
        account_type: row.account_type,
        active: row.active,
      })
    }
  })

  return user
}

//addUser:
export async function addUser(
  user: NewUser,
  db = connection,
): Promise<UserWithProfiles> {
  const existingUser = await db('users')
    .where({ auth0_id: user.auth0_id })
    .first()
  if (existingUser) {
    return existingUser
  }
  const [newUser] = await db('users')
    .insert(user)
    .returning(['id', 'auth0_id', 'username', 'email', 'avatar_url'])
  return newUser
}
