import { useState, useEffect } from 'react'
import { useUser } from '../../hooks/useUser'

export default function EditProfile() {
  const { data: user, add: updateUser } = useUser()
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Prefill form when user data loads
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
      // Call your update function here, assuming `updateUser.mutateAsync` accepts updated user data
      await updateUser.mutateAsync({
        newUser: form,
        token: '',
      })
      alert('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <p>Loading user data...</p>

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-6 rounded bg-white p-4 shadow"
    >
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label htmlFor="avatar_url" className="mb-1 block font-medium">
          Avatar URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={form.avatar_url}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
          placeholder="https://example.com/avatar.png"
        />
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

      <button
        type="submit"
        disabled={loading}
        className="hover:bg-primary-hover rounded bg-primary px-6 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
