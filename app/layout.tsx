import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/Layout'
import { OneSignalProvider } from '@/components/OneSignalProvider'
import ServiceWorkerRegistration from './service-worker'

export const metadata: Metadata = {
  title: 'Omnigm',
  description: 'Omnigm - Your all-in-one platform',
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Omnigm',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ServiceWorkerRegistration />
        <OneSignalProvider>
          <Layout>{children}</Layout>
        </OneSignalProvider>
      </body>
    </html>
  )
}

