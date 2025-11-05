'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    OneSignal?: any
    OneSignalDeferred?: any
  }
}

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
      // Load OneSignal SDK
      const script = document.createElement('script')
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        // Initialize OneSignal
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
            safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
            notifyButton: {
              enable: false,
            },
            allowLocalhostAsSecureOrigin: true,
          })
        }
      }
    }
  }, [])

  return <>{children}</>
}
