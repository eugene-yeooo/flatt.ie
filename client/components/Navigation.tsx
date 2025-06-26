import { Link, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Home, FileText } from 'lucide-react'

const navTabs = [
  { id: '/', label: 'Dashboard', icon: Home },
  { id: '/bills', label: 'Bills', icon: FileText },
]

export default function Navigation() {
  const location = useLocation()
  const activeTab = location.pathname

  return (
    <Card className="border-money-200 m-4 bg-white/60 p-1 backdrop-blur-sm">
      <div className="flex space-x-1">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              to={tab.id}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
