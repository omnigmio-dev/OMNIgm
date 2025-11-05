export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // optional but helps avoid edge/static
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan

        if (userId && plan) {
          // Update user subscription in database
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan,
              stripe_customer_id: session.customer as string,
              status: 'active',
            })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user from customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          if (subscription.status === 'active') {
            // Determine plan from subscription
            const priceId = subscription.items.data[0]?.price.id
            const plan =
              priceId === process.env.STRIPE_PRO_PRICE_ID
                ? 'PRO'
                : priceId === process.env.STRIPE_ALL_ACCESS_PRICE_ID
                ? 'ALL_ACCESS'
                : null

            if (plan) {
              await supabase
                .from('subscriptions')
                .upsert({
                  user_id: profile.id,
                  plan,
                  stripe_customer_id: customerId,
                  status: subscription.status,
                })
            }
          } else {
            // Subscription canceled or past due
            await supabase
              .from('subscriptions')
              .update({ status: subscription.status })
              .eq('user_id', profile.id)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

