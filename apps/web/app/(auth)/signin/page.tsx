'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const [message, setMessage] = useState('')
   const router = useRouter()
   const supabase = createClient()

   const handleEmailSignIn = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setMessage('')

      const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
      })

      if (error) {
         setMessage(error.message)
      } else {
         router.push('/dashboard')
         router.refresh()
      }

      setLoading(false)
   }

   const handleOAuthSignIn = async (provider: 'google' | 'github') => {
      const { data, error } = await supabase.auth.signInWithOAuth({
         provider,
         options: {
            redirectTo: `${window.location.origin}/auth/callback`,
         },
      })

      if (error) {
         console.error('OAuth Error:', error)
         setMessage(error.message)
      } else if (data?.url) {
         // Fallback in case the adapter doesn't automatically redirect
         window.location.href = data.url
      }
   }

   return (
      <Card>
         <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
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
               <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     disabled={loading}
                  />
               </div>
               <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
               </Button>
            </form>

            {message && (
               <p className="text-sm text-center text-red-600">
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
               <Button type="button" variant="outline" onClick={() => handleOAuthSignIn('google')}>
                  Google
               </Button>
               <Button type="button" variant="outline" onClick={() => handleOAuthSignIn('github')}>
                  GitHub
               </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link href="/register" className="font-medium text-primary hover:underline">
                  Sign up
               </Link>
            </p>
         </CardContent>
      </Card>
   )
}