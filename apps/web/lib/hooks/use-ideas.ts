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
      
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: data.project_id, context: data.context })
      })
      
      let ideasData, error = null;
      if (!response.ok) {
        throw new Error(`Failed to generate ideas: ${response.statusText}`)
      } else {
        const resJson = await response.json();
        ideasData = resJson.data !== undefined ? resJson.data : resJson;
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
      const response = await fetch('/api/validate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: ideaId, idea_data: idea })
      });
      
      let validationData, validationError = null;
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        validationError = new Error(`Failed to call validate-idea: ${errData.error || response.statusText}`);
      } else {
        const resJson = await response.json();
        // Some endpoints return { data: ... }, others return { ... } directly
        validationData = resJson.data !== undefined ? resJson.data : resJson;
      }
      
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