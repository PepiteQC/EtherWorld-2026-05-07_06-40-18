'use client'

import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="pixel-window mx-auto max-w-md p-8">
          <div className="mb-4 text-6xl">
            <span className="inline-block animate-bounce">&#9889;</span>
          </div>
          <h1 className="mb-4 font-mono text-2xl font-bold text-primary">
            ACCOUNT CREATED!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Check your email to confirm your account, then you can start exploring EtherWorld!
          </p>
          <Link
            href="/auth/login"
            className="pixel-button inline-block bg-primary px-6 py-3 text-primary-foreground"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
