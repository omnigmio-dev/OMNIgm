"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<string | null>(null);
  const supabase = createClient();

  // Load user's current subscription (if any)
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      if (data?.plan) setSubscription(data.plan);
    };
    load();
  }, [supabase]);

  // Start Stripe Checkout
  const handleCheckout = async (plan: "PRO" | "ALL_ACCESS") => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in first");
        return;
      }

      // Create a Checkout Session on the server
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create checkout session");

      // Load Stripe.js in the browser
      const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripeJs) throw new Error("Stripe failed to load");
      if (!data?.sessionId) throw new Error("No sessionId returned from server");

      // Narrow 'any' cast to avoid server-SDK type collision
      await (stripeJs as any).redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Open Stripe Customer Portal
  const handlePortal = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in first");
        return;
      }

      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create portal session");

      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Portal error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
      </div>

      {/* Current plan notice */}
      {subscription && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Current Plan: <strong>{subscription}</strong>
          </p>
          <button
            onClick={handlePortal}
            disabled={loading}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Manage Subscription
          </button>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRO */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PRO</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4">
            $4.99<span className="text-lg text-gray-600">/month</span>
          </p>
          <ul className="mb-6 space-y-2 text-gray-600">
            <li>✓ All PRO features</li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
          </ul>
          <button
            onClick={() => handleCheckout("PRO")}
            disabled={loading || subscription === "PRO"}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscription === "PRO" ? "Current Plan" : "Subscribe"}
          </button>
        </div>

        {/* ALL_ACCESS */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
          <div className="mb-2">
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              POPULAR
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ALL_ACCESS</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4">
            $9.99<span className="text-lg text-gray-600">/month</span>
          </p>
          <ul className="mb-6 space-y-2 text-gray-600">
            <li>✓ Everything in PRO</li>
            <li>✓ All premium features</li>
            <li>✓ Unlimited access</li>
            <li>✓ 24/7 support</li>
          </ul>
          <button
            onClick={() => handleCheckout("ALL_ACCESS")}
            disabled={loading || subscription === "ALL_ACCESS"}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscription === "ALL_ACCESS" ? "Current Plan" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
