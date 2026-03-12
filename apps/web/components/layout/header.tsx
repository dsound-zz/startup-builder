'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/hooks/use-auth'
import { Settings, LogOut } from 'lucide-react'

export function Header() {
   const { user, signOut } = useAuth()
   const router = useRouter()

   const handleSignOut = async () => {
      await signOut()
      router.push('/signin')
   }

   const getInitials = (email: string) => {
      return email.slice(0, 2).toUpperCase()
   }

   return (
      <header className="border-b">
         <div className="flex h-16 items-center px-8">
            <div className="ml-auto flex items-center space-x-4">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                           <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email ?? ''} />
                           <AvatarFallback>{user?.email ? getInitials(user.email) : 'U'}</AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                     <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                           <p className="text-sm font-medium leading-none">
                              {user?.user_metadata?.full_name || 'User'}
                           </p>
                           <p className="text-xs leading-none text-muted-foreground">
                              {user?.email}
                           </p>
                        </div>
                     </DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </header>
   )
}