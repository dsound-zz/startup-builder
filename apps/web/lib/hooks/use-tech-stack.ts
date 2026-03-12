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
      // This will be replaced with actual Edge Function call
      const mockRecommendation = {
        project_id: data.project_id,
        idea_id: data.idea_id,
        frontend_framework: {
          recommendation: "Next.js",
          confidence: 85,
          reasoning: "Perfect for startup MVPs with built-in SSR, API routes, and excellent developer experience",
          alternatives: ["React + Vite", "SvelteKit", "Nuxt.js"]
        },
        backend_framework: {
          recommendation: "Node.js + Express",
          confidence: 78,
          reasoning: "Fast development, large ecosystem, perfect for API-first startups",
          alternatives: ["Python + FastAPI", "Go + Gin", "Ruby on Rails"]
        },
        database: {
          recommendation: "PostgreSQL",
          confidence: 92,
          reasoning: "Reliable, scalable, perfect for structured startup data with Supabase integration",
          alternatives: ["MongoDB", "Supabase", "PlanetScale"]
        },
        infrastructure: {
          recommendation: "Vercel + Supabase",
          confidence: 88,
          reasoning: "Zero-config deployment, global CDN, perfect for startup scale",
          alternatives: ["Netlify + Supabase", "AWS Amplify", "Railway"]
        },
        tools: {
          recommendation: ["Tailwind CSS", "TypeScript", "Prisma", "Stripe"],
          confidence: 82,
          reasoning: "Modern development stack with type safety, styling utilities, and payment integration"
        },
        confidence_score: 85,
        complexity_level: "intermediate",
        estimated_cost: "$50-200/month (scales with usage)",
        timeline_estimate: "2-4 weeks for MVP",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: techStack, error } = await supabase
        .from('tech_stacks')
        .insert(mockRecommendation)
        .select()
        .single()
      
      if (error) throw error
      return techStack as TechStack
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