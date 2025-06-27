import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'

export default function Authenticate() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

  return (
    <div className="flex w-full items-center justify-end px-2 py-2">
      <div className="ml-auto flex items-center gap-4 text-sm">
        {isAuthenticated ? (
          <>
            <span style={{ color: 'var(--primary)' }}>Hey, {user?.name}!</span>
            <button
              onClick={() =>
                logout({
                  logoutParams: { returnTo: window.location.origin },
                })
              }
              style={{
                borderRadius: '0.375rem',
                backgroundColor: 'var(--primary)',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                color: 'var(--primary-foreground)',
                transition: 'background-color 0.3s ease',
              }}
            >
              <LogOut />
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              borderRadius: '0.375rem',
              backgroundColor: 'var(--primary)',
              padding: '0.5rem 1rem',
              fontWeight: 600,
              color: 'var(--primary-foreground)',
              transition: 'background-color 0.3s ease',
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}
