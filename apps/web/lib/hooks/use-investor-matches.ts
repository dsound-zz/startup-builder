'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { InvestorMatch } from '@/lib/types/database'

export function useInvestorMatches(ideaId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: investorMatches, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['investor-matches', ideaId],
    queryFn: async () => {
      let query = supabase
        .from('investor_matches')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (ideaId) {
        query = query.eq('idea_id', ideaId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data as InvestorMatch[]
    },
    enabled: !!ideaId
  })

  const generateInvestorMatches = useMutation({
    mutationFn: async (data: { idea_id: string; idea_data: any }) => {
      // Call the generate-investor-matches Edge Function
      const { data: matchData, error: matchError } = await supabase.functions.invoke('generate-investor-matches', {
        body: { idea_id: data.idea_id, idea_data: data.idea_data }
      })
      
      if (matchError) {
        throw new Error(`Failed to generate investor matches: ${matchError.message}`)
      }
      
      // Save the investor matches to the database
      const { data: savedMatch, error: saveError } = await supabase
        .from('investor_matches')
        .insert({
          idea_id: data.idea_id,
          project_id: data.idea_data.project_id,
          match_score: matchData.match_score,
          matching_reasons: matchData.matching_reasons,
          potential_valuation_range: matchData.potential_valuation_range,
          funding_stage: matchData.funding_stage,
          investor_profiles: matchData.investor_profiles,
          investor_interest_level: matchData.investor_interest_level,
          competitive_advantage: matchData.competitive_advantage,
          market_differentiators: matchData.market_differentiators,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (saveError) throw saveError
      return savedMatch as InvestorMatch
    },
    onSuccess: (newMatch) => {
      queryClient.setQueryData(['investor-matches', newMatch.idea_id], 
        (old: InvestorMatch[] = []) => [newMatch, ...old]
      )
    }
  })

  const updateInvestorMatch = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<InvestorMatch> & { id: string }) => {
      const { data, error } = await supabase
        .from('investor_matches')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as InvestorMatch
    },
    onSuccess: (updatedMatch) => {
      queryClient.setQueryData(['investor-matches', updatedMatch.idea_id], 
        (old: InvestorMatch[] = []) => old.map(match => 
          match.id === updatedMatch.id ? updatedMatch : match
        )
      )
    }
  })

  const deleteInvestorMatch = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investor_matches')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['investor-matches'], 
        (old: InvestorMatch[] = []) => old.filter(match => match.id !== id)
      )
    }
  })

  return {
    investorMatches,
    isLoading,
    error,
    generateInvestorMatches,
    updateInvestorMatch,
    deleteInvestorMatch
  }
}