import { Link, useLocation } from 'react-router-dom'
import { Card } from '@/components/components/ui/card'
import { Home, Users, Clipboard, Receipt } from 'lucide-react'
import { useUser } from '../hooks/useUser'
const navTabs = [
  { id: '/payments', label: 'Payments', icon: Home },
  { id: '/flatmates', label: 'Flatties', icon: Users },
  { id: '/bills', label: 'Bills', icon: Receipt },
  { id: '/expense', label: 'Expenses', icon: Receipt },
  { id: '/report', label: 'Reports', icon: Clipboard },
]

export default function Navigation() {
  const location = useLocation()
  const activeTab = location.pathname
  const user = useUser()
  return (
    <Card
      className="m-4 p-2 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(255 255 255 / 0.6)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center justify-between space-x-4">
        {/* Tabs container */}
        <div className="flex flex-1 space-x-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <Link
                key={tab.id}
                to={tab.id}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium shadow transition-all duration-200 hover:shadow-md`}
                style={{
                  backgroundColor: isActive
                    ? 'var(--primary)'
                    : 'var(--background)',
                  color: isActive
                    ? 'var(--background)'
                    : 'var(--muted-foreground)',
                }}
              >
                <Icon
                  className="h-4 w-4"
                  style={{
                    color: isActive
                      ? 'var(--primary-foreground)'
                      : 'var(--muted-foreground)',
                  }}
                />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User avatar/profile */}
        <div className="flex items-center justify-end px-2 py-2">
          {user?.data?.avatar_url ? (
            <Link to="/profile" aria-label="Go to your profile">
              <img
                src={user.data.avatar_url}
                alt={`${user.data.username || 'User'} avatar`}
                className="h-10 w-10 cursor-pointer rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-gray-600"
              aria-label="Go to your profile"
            >
              {user?.data?.username?.[0]?.toUpperCase() || 'U'}
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
