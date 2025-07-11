import { useState, useEffect, useRef } from 'react'
import { useEditProfile, useUser } from '../../hooks/useUser'
import UploadPhoto from './PhotoUpload'

export default function EditProfile() {
  const { data: user } = useUser()
  const editProfile = useEditProfile()
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      })
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('username', form.username)
      formData.append('bio', form.bio)

      if (newPhoto) {
        formData.append('avatar_url', newPhoto)
      }

      await editProfile.mutateAsync(formData)
      alert('Profile updated successfully!')
      setIsEditing(false) // optional: hide form on success
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading user data...</p>

  return (
    <form className="mx-auto max-w-lg space-y-6 rounded border-4 border-[var(--primary)] bg-[var(--background)] p-4 shadow-xl">
      {error && <p className="text-red-600">{error}</p>}

      <div>
        {isEditing && (
          <div className="flex justify-center">
            <UploadPhoto
              newPhoto={newPhoto}
              onChange={setNewPhoto}
              fileInputRef={fileInputRef}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="username" className="mb-1 block font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block font-medium">
          Email (read only)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          readOnly
          className="w-full rounded border bg-gray-100 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          className="w-full rounded border px-3 py-2"
          placeholder="Tell us a bit about yourself"
        />
      </div>

      <div className="flex">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="ml-auto rounded border border-[var(--primary)] px-4 py-2 text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
