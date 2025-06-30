import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../../client/hooks/useUser'
import { LogOut } from 'lucide-react'

export default function Profile() {
  const { logout } = useAuth0()
  const { data: user } = useUser()
  console.log('User data:', user)

  return (
    <div className="flex w-full items-center justify-end px-2 py-2">
      <div className="ml-auto flex items-center gap-4 text-sm">
        <span
          style={{
            color: 'var(--primary)',
            borderColor: 'var(--border)',
          }}
        >
          {user?.username}&apos;s Flat Account
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
