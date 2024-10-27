import { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Register | AI-Powered Learning Platform',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-8">
        <h1 className="mb-4 text-2xl font-bold">Create an Account</h1>
        <RegisterForm />
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </>
  )
}