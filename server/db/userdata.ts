import connection from './connection'

interface Profile {
  id: string
  profile_name: string
  account_type: string
  active: boolean
}

interface UserWithProfiles {
  id: string
  username: string
  email: string
  avatar_url: string | null
  profiles: Profile[] // plural and array
}

interface NewUser {
  auth0_id: string
  username: string
  email: string
  avatar_url: string
}
export async function getAllUsersWithProfiles(): Promise<UserWithProfiles[]> {
  const rows = await connection('users')
    .leftJoin('profiles', 'users.id', 'profiles.user_id')
    .select(
      'users.id as user_id',
      'users.username',
      'users.email',
      'users.avatar_url',
      'profiles.id as profile_id',
      'profiles.profile_name',
      'profiles.account_type',
      'profiles.active',
    )

  const userMap = new Map<string, UserWithProfiles>()

  rows.forEach((row) => {
    if (!userMap.has(row.user_id)) {
      userMap.set(row.user_id, {
        id: row.user_id,
        username: row.username,
        email: row.email,
        avatar_url: row.avatar_url,
        profiles: [],
      })
    }
    if (row.profile_id) {
      userMap.get(row.user_id)!.profiles.push({
        id: row.profile_id,
        profile_name: row.profile_name,
        account_type: row.account_type,
        active: row.active,
      })
    }
  })

  return Array.from(userMap.values())
}

export async function getUserWithProfileByAuth0Id(
  auth0_id: string,
  db = connection,
): Promise<UserWithProfiles | undefined> {
  const rows = await db('users')
    .leftJoin('profiles', 'users.id', 'profiles.user_id')
    .select(
      'users.id as user_id',
      'users.auth0_id',
      'users.email',
      'users.username',
      'users.avatar_url',
      'profiles.id as profile_id',
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
    avatar_url: rows[0].avatar_url,
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
