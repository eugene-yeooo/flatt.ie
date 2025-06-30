import { useUser } from '../../hooks/useUser'
import { Link } from 'react-router-dom'
import EditProfile from './EditProfile'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { logout } = useAuth0()
  const user = useUser()
  const [isEditing, setIsEditing] = useState(false)

  if (!user?.data)
    return <p className="py-8 text-center">Loading user data...</p>

  const toggleEdit = () => setIsEditing((prev) => !prev)

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      {/* Centered Profile Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        {user.data.avatar_url ? (
          <img
            src={user.data.avatar_url}
            alt={`${user.data.username}'s avatar`}
            className="object-cove h-32 w-32 rounded-full ring-4 ring-[var(--primary)]"
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
          <p className="mt-2 text-gray-700">{user.data.bio || 'No bio set.'}</p>
          <p className="mt-1 text-sm italic text-gray-400">
            Role: {user.data.account_type}
          </p>
        </div>
      </div>

      {/* Centered Action Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          to="/flattie"
          className="rounded bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-hover)]"
        >
          Back to Dashboard
        </Link>

        <button
          onClick={toggleEdit}
          className="rounded border border-[var(--primary)] px-4 py-2 text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>

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

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <EditProfile />
        </div>
      )}
    </div>
  )
}
