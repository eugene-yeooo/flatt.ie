import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function TokenLogger() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    async function fetchToken() {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently()
          console.log('🔐 Your access token:', token)
        } catch (err) {
          console.error('Error fetching token:', err)
        }
      }
    }

    fetchToken()
  }, [getAccessTokenSilently, isAuthenticated])

  return null
}
