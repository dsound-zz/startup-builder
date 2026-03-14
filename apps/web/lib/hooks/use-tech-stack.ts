'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface TechStack {
  id: string
  project_id: string
  idea_id?: string
  frontend_framework: any
  backend_framework: any
  database: any
  infrastructure: any
  tools: any
  confidence_score: number
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_cost: string
  timeline_estimate: string
  created_at: string
  updated_at: string
}

export function useTechStack(projectId?: string, ideaId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: techStacks, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tech-stacks', projectId, ideaId],
    queryFn: async () => {
      let query = supabase
        .from('tech_stacks')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (projectId) {
        query = query.eq('project_id', projectId)
      }
      
      if (ideaId) {
        query = query.eq('idea_id', ideaId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data as TechStack[]
    },
    enabled: !!projectId || !!ideaId
  })

  const recommendTechStack = useMutation({
    mutationFn: async (data: { project_id: string; idea_id?: string; idea_details?: any }) => {
      // Call the recommend-tech-stack Edge Function
      const { data: techStackData, error: techError } = await supabase.functions.invoke('recommend-tech-stack', {
        body: { project_id: data.project_id, idea_id: data.idea_id, idea_details: data.idea_details }
      })
      
      if (techError) {
        throw new Error(`Failed to recommend tech stack: ${techError.message}`)
      }
      
      // Save the tech stack to the database
      const { data: savedStack, error: saveError } = await supabase
        .from('tech_stacks')
        .insert({
          project_id: data.project_id,
          idea_id: data.idea_id,
          frontend_framework: techStackData.frontend_framework,
          backend_framework: techStackData.backend_framework,
          database: techStackData.database,
          infrastructure: techStackData.infrastructure,
          tools: techStackData.tools,
          confidence_score: techStackData.confidence_score,
          complexity_level: techStackData.complexity_level,
          estimated_cost: techStackData.estimated_cost,
          timeline_estimate: techStackData.timeline_estimate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (saveError) throw saveError
      return savedStack as TechStack
    },
    onSuccess: (newTechStack) => {
      queryClient.setQueryData(['tech-stacks', newTechStack.project_id, newTechStack.idea_id], 
        (old: TechStack[] = []) => [newTechStack, ...old]
      )
    }
  })

  const updateTechStack = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TechStack> & { id: string }) => {
      const { data, error } = await supabase
        .from('tech_stacks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as TechStack
    },
    onSuccess: (updatedTechStack) => {
      queryClient.setQueryData(['tech-stacks', updatedTechStack.project_id, updatedTechStack.idea_id], 
        (old: TechStack[] = []) => old.map(techStack => 
          techStack.id === updatedTechStack.id ? updatedTechStack : techStack
        )
      )
    }
  })

  const deleteTechStack = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tech_stacks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['tech-stacks'], 
        (old: TechStack[] = []) => old.filter(techStack => techStack.id !== id)
      )
    }
  })

  return {
    techStacks,
    isLoading,
    error,
    recommendTechStack,
    updateTechStack,
    deleteTechStack
  }
}