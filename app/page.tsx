import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Omnigm</h1>
          <p className="text-lg text-gray-600">Your all-in-one platform</p>
        </div>
        <div className="space-y-4">
          <Link
            href="/connect"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <p className="text-sm text-gray-500">
            Sign in with email to access your dashboard
          </p>
        </div>
      </div>
    </div>
  )
}

