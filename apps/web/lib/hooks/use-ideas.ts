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
      const supabase = createClient()
      
      const { data: ideasData, error } = await supabase.functions.invoke('generate-ideas', {
        body: { project_id: data.project_id, context: data.context }
      })
      
      if (error) {
        throw new Error(`Failed to generate ideas: ${error.message}`)
      }
      
      // Transform AI-generated ideas to database schema and insert them
      const ideasToInsert = ideasData.ideas.map((idea: any) => ({
        project_id: data.project_id,
        title: idea.title,
        problem: idea.problem,
        solution: idea.solution,
        target_audience: idea.target_audience,
        unique_value_proposition: idea.unique_value_proposition,
        market_size: idea.market_size || null,
        revenue_streams: [idea.revenue_model],
        status: 'draft' as const,
        score: null,
      }))
      
      // Insert all generated ideas into the database
      const { data: insertedIdeas, error: insertError } = await supabase
        .from('ideas')
        .insert(ideasToInsert)
        .select()
      
      if (insertError) {
        throw new Error(`Failed to save ideas: ${insertError.message}`)
      }
      
      return insertedIdeas as Idea[]
    },
    onSuccess: (newIdeas) => {
      queryClient.setQueryData(['ideas', newIdeas[0]?.project_id],
        (old: Idea[] = []) => [...newIdeas, ...old]
      )
    }
  })

  const validateIdea = useMutation({
    mutationFn: async (ideaId: string) => {
      const supabase = createClient()
      
      const { data: idea } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single()
      
      if (!idea) {
        throw new Error('Idea not found')
      }
      
      // Call the validate-idea Edge Function
      const { data: validationData, error: validationError } = await supabase.functions.invoke('validate-idea', {
        body: { idea_id: ideaId, idea_data: idea }
      })
      
      if (validationError) {
        throw new Error(`Failed to validate idea: ${validationError.message}`)
      }
      
      // Update the idea with validation results
      const { data: updatedIdea, error: updateError } = await supabase
        .from('ideas')
        .update({
          score: Math.round(Number(validationData.score)),
          status: 'validated',
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .select()
        .single()
      
      if (updateError) throw updateError
      return { ...updatedIdea, validation: validationData }
    },
    onSuccess: (updatedIdea) => {
      queryClient.setQueryData(['ideas', updatedIdea.project_id], 
        (old: Idea[] = []) => old.map(idea => 
          idea.id === updatedIdea.id ? { ...idea, ...updatedIdea } : idea
        )
      )
    }
  })

  const createIdea = useMutation({
    mutationFn: async (idea: Omit<Idea, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          ...idea,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (newIdea) => {
      queryClient.setQueryData(['ideas', newIdea.project_id], 
        (old: Idea[] = []) => [newIdea, ...old]
      )
    }
  })

  return {
    ideas,
    isLoading,
    error,
    generateIdeas,
    validateIdea,
    createIdea
  }
}