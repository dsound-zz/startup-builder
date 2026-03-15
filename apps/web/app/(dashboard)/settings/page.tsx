'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle
} from '@/components/ui/dialog'
import { useProfile } from '@/lib/hooks/use-profile'
import { User, Lock, AlertTriangle, LogOut, Save } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function SettingsPage() {
   const router = useRouter()
   const { profile, isLoading, updateProfile, deleteAccount, signOut } = useProfile()

   const [fullName, setFullName] = useState('')
   const [avatarUrl, setAvatarUrl] = useState('')
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

   // Initialize form when profile loads
   useState(() => {
      if (profile) {
         setFullName(profile.full_name || '')
         setAvatarUrl(profile.avatar_url || '')
      }
   })

   const handleSaveProfile = async () => {
      try {
         await updateProfile.mutateAsync({
            full_name: fullName,
            avatar_url: avatarUrl || undefined
         })
         setHasUnsavedChanges(false)
         // You can add toast notification here
      } catch (error) {
         console.error('Failed to update profile:', error)
         // You can add error toast here
      }
   }

   const handleSignOut = async () => {
      try {
         await signOut.mutateAsync()
         router.push('/signin')
      } catch (error) {
         console.error('Failed to sign out:', error)
      }
   }

   const handleDeleteAccount = async () => {
      try {
         await deleteAccount.mutateAsync()
         router.push('/')
      } catch (error) {
         console.error('Failed to delete account:', error)
         setIsDeleteDialogOpen(false)
      }
   }

   const handleFieldChange = (field: 'name' | 'avatar', value: string) => {
      if (field === 'name') {
         setFullName(value)
      } else {
         setAvatarUrl(value)
      }

      // Check if there are unsaved changes
      if (profile) {
         const nameChanged = field === 'name' ? value !== (profile.full_name || '') : fullName !== (profile.full_name || '')
         const avatarChanged = field === 'avatar' ? value !== (profile.avatar_url || '') : avatarUrl !== (profile.avatar_url || '')
         setHasUnsavedChanges(nameChanged || avatarChanged)
      }
   }

   if (isLoading) {
      return (
         <PageContainer title="Settings" description="Manage your account settings">
            <div className="flex items-center justify-center h-64">
               <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
         </PageContainer>
      )
   }

   if (!profile) {
      return (
         <PageContainer title="Settings" description="Manage your account settings">
            <Card>
               <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">Unable to load profile</p>
                  <Button onClick={() => router.push('/dashboard')} className="mt-4">
                     Return to Dashboard
                  </Button>
               </CardContent>
            </Card>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title="Settings"
         description="Manage your account settings and preferences"
      >
         <div className="space-y-6 max-w-3xl">
            {/* Profile Information */}
            <Card>
               <CardHeader>
                  <div className="flex items-center space-x-2">
                     <User className="h-5 w-5" />
                     <CardTitle>Profile Information</CardTitle>
                  </div>
                  <CardDescription>
                     Update your personal information and profile details
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name</Label>
                     <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Enter your full name"
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="bg-muted cursor-not-allowed"
                     />
                     <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                     </p>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
                     <Input
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => handleFieldChange('avatar', e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        type="url"
                     />
                  </div>

                  <div className="space-y-1">
                     <Label className="text-sm text-muted-foreground">Member Since</Label>
                     <p className="text-sm">
                        {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                     </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                     <Button
                        onClick={handleSaveProfile}
                        disabled={!hasUnsavedChanges || updateProfile.isPending}
                     >
                        <Save className="mr-2 h-4 w-4" />
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                     </Button>

                     {hasUnsavedChanges && (
                        <p className="text-sm text-muted-foreground">
                           You have unsaved changes
                        </p>
                     )}

                     {updateProfile.isSuccess && !hasUnsavedChanges && (
                        <p className="text-sm text-green-600">
                           ✓ Changes saved
                        </p>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
               <CardHeader>
                  <div className="flex items-center space-x-2">
                     <Lock className="h-5 w-5" />
                     <CardTitle>Account Security</CardTitle>
                  </div>
                  <CardDescription>
                     Manage your account security and authentication
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                           Change your password to keep your account secure
                        </p>
                     </div>
                     <Button
                        variant="outline"
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/reset_password`, '_blank')}
                     >
                        Change Password
                     </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-sm text-muted-foreground">
                           Sign out from your account on this device
                        </p>
                     </div>
                     <Button
                        variant="outline"
                        onClick={handleSignOut}
                        disabled={signOut.isPending}
                     >
                        <LogOut className="mr-2 h-4 w-4" />
                        {signOut.isPending ? 'Signing Out...' : 'Sign Out'}
                     </Button>
                  </div>
               </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
               <CardHeader>
                  <div className="flex items-center space-x-2">
                     <AlertTriangle className="h-5 w-5 text-destructive" />
                     <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </div>
                  <CardDescription>
                     Irreversible actions that will permanently affect your account
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
                     <div>
                        <p className="font-medium text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                           Permanently delete your account and all associated data
                        </p>
                     </div>
                     <Button
                       variant="default"
                       onClick={() => setIsDeleteDialogOpen(true)}
                       className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                     >
                       Delete Account
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Delete Confirmation Dialog */}
         <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                     <AlertTriangle className="h-5 w-5 text-destructive" />
                     <span>Delete Account</span>
                  </DialogTitle>
                  <DialogDescription className="space-y-2 pt-2">
                     <p>
                        Are you absolutely sure you want to delete your account? This action cannot be undone.
                     </p>
                     <p className="font-medium text-destructive">
                        This will permanently delete:
                     </p>
                     <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Your profile and account information</li>
                        <li>All your projects and startup ideas</li>
                        <li>All market analyses and business plans</li>
                        <li>All tech stack recommendations</li>
                        <li>All investor matches and data</li>
                     </ul>
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setIsDeleteDialogOpen(false)}
                     disabled={deleteAccount.isPending}
                  >
                     Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleDeleteAccount}
                    disabled={deleteAccount.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteAccount.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </PageContainer>
   )
}
