'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types/database'

export function useProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      return data as Profile
    },
  })

  const updateProfile = useMutation({
    mutationFn: async (updates: { full_name?: string; avatar_url?: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      return data as Profile
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile)
    }
  })

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      // Delete the user account - this will cascade delete all related data
      const { error } = await supabase.rpc('delete_user')
      
      if (error) {
        // Fallback: sign out if RPC doesn't exist
        await supabase.auth.signOut()
        throw new Error('Account deletion initiated. Please contact support to complete the process.')
      }
    },
    onSuccess: () => {
      queryClient.clear()
    }
  })

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    }
  })

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    deleteAccount,
    signOut
  }
}
