import { useUser } from '../../hooks/useUser'
import EditProfile from './EditProfile'
import { useState } from 'react'
import { LogOut, PencilIcon } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { logout } = useAuth0()
  const user = useUser()
  const [isEditing, setIsEditing] = useState(false)

  if (!user?.data)
    return <p className="py-8 text-center">Loading user data...</p>

  const toggleEdit = () => setIsEditing((prev) => !prev)

  return (
    <div>
      {/* Logout button top-right */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Edit button aligned right */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={toggleEdit}
            className="rounded border border-[var(--primary)] px-4 py-2 text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
            aria-label={isEditing ? 'Cancel Edit' : 'Edit Profile'}
          >
            {isEditing ? 'Cancel Edit' : <PencilIcon />}
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4 text-center">
          {user.data.avatar_url ? (
            <img
              src={user.data.avatar_url}
              alt={`${user.data.username}'s avatar`}
              className="h-32 w-32 rounded-full object-cover ring-4 ring-[var(--primary)]"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300 text-4xl font-bold text-gray-700">
              {user.data.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-[var(--primary)]">
              {user.data.name}
            </h2>
            <p className="text-gray-600">@{user.data.username}</p>
            <p className="text-sm text-gray-500">{user.data.email}</p>
            <p className="mt-2 text-gray-700">
              {user.data.bio || 'No bio set.'}
            </p>
            <p className="mt-1 text-sm italic text-gray-400">
              Role: {user.data.account_type}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <EditProfile />
          </div>
        )}
      </div>
    </div>
  )
}
