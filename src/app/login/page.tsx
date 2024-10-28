import { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Login | AI-Powered Learning Platform',
  description: 'Log in to your account',
}

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-8 mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
          <CardDescription className="text-center">Welcome back! Please log in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm/>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}