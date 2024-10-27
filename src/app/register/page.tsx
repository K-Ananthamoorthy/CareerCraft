import { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Register | AI-Powered Learning Platform',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-8 mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Join our AI-powered learning platform for engineering students.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}