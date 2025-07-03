import FlattieCard from './FlattiesCard'
import { useAllUsers } from '../../hooks/useUser'
import useCanEdit from '../../hooks/useCanEdit'

export default function Flatties() {
  const { data: users, isLoading, isError } = useAllUsers()
  console.log('users data:', users)
  users?.forEach((u) => console.log('user id:', u.user_id, 'name:', u.username))
  const canEdit = useCanEdit()
  return (
    <div className="mx-auto max-w-3xl px-4">
      {canEdit && <div className="mb-4 text-center"></div>}
      {isLoading && (
        <p className="text-center text-gray-500">Loading flatmates...</p>
      )}
      {isError && (
        <p className="text-center text-red-500">Failed to load flatmates.</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users?.map((mate) => (
          <FlattieCard
            key={mate.user_id}
            id={mate.user_id}
            name={mate.username}
            credit={mate.credit}
            bio={mate.bio}
            avatar_url={mate.avatar_url}
          />
        ))}
      </div>
    </div>
  )
}
