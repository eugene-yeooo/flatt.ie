import { useAuth0 } from '@auth0/auth0-react'
import { LogOut } from 'lucide-react'
import Front from './Front'

export default function Authenticate() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return <Front loginWithRedirect={loginWithRedirect} />
  }

  return (
    <div className="flex w-full items-center justify-end px-2 py-2">
      <div className="ml-auto flex items-center gap-4 text-sm">
        <span
          style={{
            color: 'var(--primary)',
            backgroundColor: 'rgba(255 255 255 / 0.6)',
            borderColor: 'var(--border)',
          }}
        >
          {user?.name}'s Flat Account
        </span>
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
          }}
        >
          <LogOut />
        </button>
      </div>
    </div>
  )
}
