import { Link, useLocation } from 'react-router-dom'
import { Card } from '@/components/components/ui/card'
import { Home, Users, Clipboard, Receipt } from 'lucide-react'
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

  return (
    <Card
      className="m-4 p-2 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(255 255 255 / 0.6)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-center justify-center">
        {/* Tabs container */}
        <div className="flex space-x-3">
          {navTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <Link
                key={tab.id}
                to={tab.id}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-4 font-medium shadow transition-all duration-200 hover:shadow-md`}
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
      </div>
    </Card>
  )
}
