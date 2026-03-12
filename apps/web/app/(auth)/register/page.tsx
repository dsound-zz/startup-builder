'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function RegisterPage() {
   const [email, setEmail] = useState('')
   const [fullName, setFullName] = useState('')
   const [loading, setLoading] = useState(false)
   const [message, setMessage] = useState('')
   const supabase = createClient()

   const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithOtp({
         email,
         options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
               full_name: fullName,
            },
         },
      })

      if (error) {
         setMessage(error.message)
      } else {
         setMessage('Check your email to complete registration!')
      }

      setLoading(false)
   }

   const handleOAuthSignUp = async (provider: 'google' | 'github') => {
      const { error } = await supabase.auth.signInWithOAuth({
         provider,
         options: {
            redirectTo: `${window.location.origin}/auth/callback`,
         },
      })

      if (error) {
         setMessage(error.message)
      }
   }

   return (
      <Card>
         <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                     id="fullName"
                     type="text"
                     placeholder="John Doe"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     required
                     disabled={loading}
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     type="email"
                     placeholder="you@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     disabled={loading}
                  />
               </div>
               <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
               </Button>
            </form>

            {message && (
               <p className={`text-sm text-center ${message.includes('Check') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
               </p>
            )}

            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <Separator />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button variant="outline" onClick={() => handleOAuthSignUp('google')}>
                  Google
               </Button>
               <Button variant="outline" onClick={() => handleOAuthSignUp('github')}>
                  GitHub
               </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
               Already have an account?{' '}
               <Link href="/signin" className="font-medium text-primary hover:underline">
                  Sign in
               </Link>
            </p>
         </CardContent>
      </Card>
   )
}