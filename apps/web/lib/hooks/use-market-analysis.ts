'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { MarketAnalysis } from '@/lib/types/database'

export function useMarketAnalysis(ideaId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: marketAnalyses, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['market-analyses', ideaId],
    queryFn: async () => {
      let query = supabase
        .from('market_analyses')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (ideaId) {
        query = query.eq('idea_id', ideaId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data as MarketAnalysis[]
    },
    enabled: !!ideaId
  })

  const analyzeMarket = useMutation({
    mutationFn: async (data: { idea_id: string; idea_data: any }) => {
      const supabase = createClient()
      
      // Call the analyze-market Edge Function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-market', {
        body: { idea_id: data.idea_id, idea_data: data.idea_data }
      })
      
      if (analysisError) {
        throw new Error(`Failed to analyze market: ${analysisError.message}`)
      }
      
      // Normalize competition_level to match DB constraint
      const validCompLevels = ['low', 'medium', 'high', 'very_high'] as const
      const rawCompLevel = String(analysisData.competition_level || 'medium').toLowerCase().replace(/\s+/g, '_')
      const competitionLevel = validCompLevels.includes(rawCompLevel as any) ? rawCompLevel : 'medium'
      
      // Save the market analysis to the database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('market_analyses')
        .insert({
          idea_id: data.idea_id,
          project_id: data.idea_data.project_id,
          total_addressable_market: analysisData.total_addressable_market,
          serviceable_addressable_market: analysisData.serviceable_addressable_market,
          serviceable_obtainable_market: analysisData.serviceable_obtainable_market,
          competitors: analysisData.competitors || [],
          competition_level: competitionLevel,
          competitive_advantages: analysisData.competitive_advantages || [],
          market_growth_rate: analysisData.market_growth_rate,
          market_trends: analysisData.market_trends || [],
          emerging_opportunities: analysisData.emerging_opportunities || [],
          market_risks: analysisData.market_risks || [],
          regulatory_considerations: analysisData.regulatory_considerations,
          market_score: Math.round(Number(analysisData.market_score)),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (saveError) throw saveError
      return savedAnalysis as MarketAnalysis
    },
    onSuccess: (newAnalysis) => {
      queryClient.setQueryData(['market-analyses', newAnalysis.idea_id], 
        (old: MarketAnalysis[] = []) => [newAnalysis, ...old]
      )
    }
  })

  const updateMarketAnalysis = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketAnalysis> & { id: string }) => {
      const { data, error } = await supabase
        .from('market_analyses')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as MarketAnalysis
    },
    onSuccess: (updatedAnalysis) => {
      queryClient.setQueryData(['market-analyses', updatedAnalysis.idea_id], 
        (old: MarketAnalysis[] = []) => old.map(analysis => 
          analysis.id === updatedAnalysis.id ? updatedAnalysis : analysis
        )
      )
    }
  })

  const deleteMarketAnalysis = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('market_analyses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['market-analyses'], 
        (old: MarketAnalysis[] = []) => old.filter(analysis => analysis.id !== id)
      )
    }
  })

  return {
    marketAnalyses,
    isLoading,
    error,
    analyzeMarket,
    updateMarketAnalysis,
    deleteMarketAnalysis
  }
}