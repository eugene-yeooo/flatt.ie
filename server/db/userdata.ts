import connection from './connection'

export async function getUsersWithProfiles() {
  // Join users with profiles
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

  const usersMap = new Map()

  rows.forEach((row) => {
    if (!usersMap.has(row.user_id)) {
      usersMap.set(row.user_id, {
        id: row.user_id,
        username: row.username,
        email: row.email,
        avatar_url: row.avatar_url,
        profiles: [],
      })
    }
    if (row.profile_id) {
      usersMap.get(row.user_id).profiles.push({
        id: row.profile_id,
        profile_name: row.profile_name,
        account_type: row.account_type,
        active: row.active,
      })
    }
  })

  return Array.from(usersMap.values())
}
