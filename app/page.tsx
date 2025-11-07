import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Omnigm</h1>
        <p className="text-lg text-gray-600">Your all-in-one platform</p>

        <div className="space-y-4">
          <Link
            href="/connect"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>

          <p className="text-sm text-gray-500">Sign in with email to access your dashboard</p>
        </div>
      </div>
    </div>
  );
}
