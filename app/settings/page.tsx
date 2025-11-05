import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email || 'Not signed in'}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscription</h2>
          <Link
            href="/billing"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Manage Billing →
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Enable notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Email updates</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

