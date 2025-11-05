import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome!</h2>
          <p className="text-gray-600">
            {user?.email ? `Signed in as ${user.email}` : 'Not signed in'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Stats</h2>
          <p className="text-gray-600">Your stats will appear here</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    </div>
  )
}

