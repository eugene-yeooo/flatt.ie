import { useAuth0 } from '@auth0/auth0-react'

import VantaFogBackground from './VantaNetBackground'
import { Progress } from '@radix-ui/react-progress'
import { useEffect, useState } from 'react'

const buttonStyle = {
  borderRadius: '0.5rem',
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  padding: '0.75rem 1.5rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
}

export default function Front() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval) // stop when 100%
          return 100
        }
        return oldProgress + 1 // increase by 1% every 50ms (adjust speed here)
      })
    }, 50)

    return () => clearInterval(interval) // cleanup on unmount
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--background)',
          color: 'var(--primary)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        <div style={{ width: '50%' }}>
          <Progress value={progress} />
        </div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return (
      <div
        className="front-page relative z-0"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--foreground)',
          padding: '2rem',
        }}
      >
        <VantaFogBackground />
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'var(--primary)',
            marginBottom: '3rem',
            userSelect: 'none',
          }}
        >
          flatt.ie
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={() => loginWithRedirect()} style={buttonStyle}>
            Login
          </button>
          <button
            onClick={() => {
              loginWithRedirect({
                authorizationParams: {
                  redirectUri: `${window.location.origin}/register`,
                },
              })
            }}
          >
            Register
            <Progress value={33} />
          </button>
        </div>
      </div>
    )
  }
  return null
}
