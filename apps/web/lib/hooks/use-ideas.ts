'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Idea } from '@/lib/types/database'

export function useIdeas(projectId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: ideas, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['ideas', projectId],
    queryFn: async () => {
      let query = supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (projectId) {
        query = query.eq('project_id', projectId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data as Idea[]
    },
    enabled: !!projectId || projectId === undefined
  })

  const generateIdeas = useMutation({
    mutationFn: async (data: { project_id: string; context: string }) => {
      // This will be replaced with actual Edge Function call
      const mockIdeas = [
        {
          id: '1',
          project_id: data.project_id,
          title: 'AI-Powered Market Research Platform',
          problem: 'Startups struggle with comprehensive market research and competitor analysis',
          solution: 'AI-driven platform that automatically analyzes markets, competitors, and trends',
          target_audience: 'Entrepreneurs, startup founders, market researchers',
          unique_value_proposition: 'Real-time market intelligence with predictive analytics',
          market_size: '$15B+ market research industry',
          revenue_streams: ['Subscription SaaS with enterprise pricing'],
          status: 'draft',
          score: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      return mockIdeas
    },
    onSuccess: (newIdeas) => {
      queryClient.setQueryData(['ideas', newIdeas[0]?.project_id], 
        (old: Idea[] = []) => [...newIdeas, ...old]
      )
    }
  })

  const validateIdea = useMutation({
    mutationFn: async (ideaId: string) => {
      // This will be replaced with actual Edge Function call
      const validationResult = {
        score: Math.floor(Math.random() * 40) + 60,
        strengths: ['Strong market opportunity', 'Clear target audience'],
        weaknesses: ['High competition', 'Complex implementation'],
        recommendations: ['Focus on niche market first']
      }
      
      const { data, error } = await supabase
        .from('ideas')
        .update({ 
          score: validationResult.score,
          status: 'validated',
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .select()
        .single()
      
      if (error) throw error
      return { ...data, validation: validationResult }
    },
    onSuccess: (updatedIdea) => {
      queryClient.setQueryData(['ideas', updatedIdea.project_id], 
        (old: Idea[] = []) => old.map(idea => 
          idea.id === updatedIdea.id ? { ...idea, ...updatedIdea } : idea
        )
      )
    }
  })

  const updateIdea = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Idea> & { id: string }) => {
      const { data, error } = await supabase
        .from('ideas')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Idea
    },
    onSuccess: (updatedIdea) => {
      queryClient.setQueryData(['ideas', updatedIdea.project_id], 
        (old: Idea[] = []) => old.map(idea => 
          idea.id === updatedIdea.id ? updatedIdea : idea
        )
      )
    }
  })

  const deleteIdea = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['ideas'], 
        (old: Idea[] = []) => old.filter(idea => idea.id !== id)
      )
    }
  })

  return {
    ideas,
    isLoading,
    error,
    generateIdeas,
    validateIdea,
    updateIdea,
    deleteIdea
  }
}