import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useAddUser, useUser } from '../../hooks/useUser'
import { IfAuthenticated, IfNotAuthenticated } from '../Authenticated'
import Profile from '../Profile/Profile'

function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { getAccessTokenSilently, user: auth0User } = useAuth0()
  const user = useUser()
  const navigate = useNavigate()
  const addUser = useAddUser()
  // Form state for user input
  const [form, setForm] = useState({
    name: '',
    username: auth0User?.nickname || auth0User?.name || '',
    email: auth0User?.email || '',
    avatar_url: auth0User?.picture || '',
    account_type: 'flattie', //default
  })

  useEffect(() => {
    if (user.data) navigate('/flattie')
  }, [user.data, navigate])

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    })
  }

  const handleMutationSuccess = () => {
    setErrorMsg('')
  }

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setErrorMsg(error.message)
    } else {
      setErrorMsg('Unknown error occurred')
    }
  }

  const mutationOptions = {
    onSuccess: handleMutationSuccess,
    onError: handleError,
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    try {
      console.log('Register form submitted')

      const token = await getAccessTokenSilently()
      await addUser.mutateAsync({ newUser: form, token }, mutationOptions)
    } catch (err) {
      handleError(err)
    }
  }

  const hideError = () => setErrorMsg('')

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      <IfAuthenticated>
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-[var(--primary)]">
            Register your flatt.ie account
          </h1>

          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
              <p>Error: {errorMsg}</p>
              <button
                onClick={hideError}
                className="mt-2 rounded bg-red-600 px-3 py-1 text-white"
              >
                Okay
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>{' '}
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm"
                readOnly
              />
            </div>
            <button
              type="submit"
              disabled={!form.username || !form.email}
              className="/* bg changes on hover */ w-full
  rounded-md bg-[var(--primary)]     px-4 py-2 text-white transition  hover:bg-[var(--background-hover)]
  hover:text-[var(--primary)]"
            >
              Register
            </button>
          </form>
        </div>
        <Profile />
      </IfAuthenticated>

      <IfNotAuthenticated>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Please sign in to register
        </h1>
      </IfNotAuthenticated>
    </div>
  )
}

export default Register
