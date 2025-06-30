import { useUser } from '../../hooks/useUser'
import { Link } from 'react-router-dom'
import EditProfile from './EditProfile'
import { useState } from 'react'

export default function Profile() {
  const user = useUser()
  const [isEditing, setIsEditing] = useState(false)
  if (!user) return <p>Loading user data...</p>
  const toggleEdit = () => setIsEditing((prev) => !prev)

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center space-x-4">
        {user?.data?.avatar_url ? (
          <img
            src={user?.data.avatar_url}
            alt={`${user?.data.username}'s avatar`}
            className="h-40 w-40 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl font-bold text-gray-700">
            {user?.data?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">{user?.data?.name}</h2>
          <p className="text-gray-600">@{user?.data?.username}</p>
          <p className="text-sm text-gray-500">{user?.data?.email}</p>
          <p className="mt-2 text-gray-700">
            {user?.data?.bio || 'No bio set.'}
          </p>
          <p className="mt-1 text-sm italic text-gray-400">
            Role: {user?.data?.account_type}
          </p>
          <Link
            to="/flattie"
            className="hover:bg-primary-hover mt-2 inline-block rounded bg-primary px-3 py-1 text-white"
          >
            Back to Dashboard
          </Link>
        </div>
        <button
          onClick={toggleEdit}
          className="hover:bg-primary-hover ml-4 rounded bg-primary px-3 py-1 text-black"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      {isEditing && <EditProfile />}
    </div>
  )
}
