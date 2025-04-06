'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to boards page
    router.push('/boards')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  )
}
