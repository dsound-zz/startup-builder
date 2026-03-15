'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { BusinessPlan } from '@/lib/types/database'

export function useBusinessPlan(ideaId?: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { 
    data: businessPlans, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['business-plans', ideaId],
    queryFn: async () => {
      let query = supabase
        .from('business_plans')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (ideaId) {
        query = query.eq('idea_id', ideaId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data as BusinessPlan[]
    },
    enabled: !!ideaId
  })

  const generateBusinessPlan = useMutation({
    mutationFn: async (data: { idea_id: string; idea_data: any }) => {
      // Call the generate-business-plan Edge Function
      const { data: businessPlanData, error: planError } = await supabase.functions.invoke('generate-business-plan', {
        body: { idea_id: data.idea_id, idea_data: data.idea_data }
      })
      
      if (planError) {
        throw new Error(`Failed to generate business plan: ${planError.message}`)
      }
      
      // The edge function returns { success, data: {...} }
      const planData = businessPlanData.data || businessPlanData
      
      // Normalize enum values to match DB constraints
      const validLevels = ['low', 'medium', 'high', 'very_high'] as const
      const rawRisk = String(planData.risk_level || 'medium').toLowerCase().replace(/\s+/g, '_')
      const rawGrowth = String(planData.growth_potential || 'medium').toLowerCase().replace(/\s+/g, '_')
      const riskLevel = validLevels.includes(rawRisk as any) ? rawRisk : 'medium'
      const growthPotential = validLevels.includes(rawGrowth as any) ? rawGrowth : 'medium'
      
      // Save the business plan to the database
      const { data: savedPlan, error: saveError } = await supabase
        .from('business_plans')
        .insert({
          idea_id: data.idea_id,
          project_id: data.idea_data.project_id,
          executive_summary: planData.executive_summary,
          company_description: planData.company_description,
          market_analysis: planData.market_analysis,
          organization_structure: planData.organization_structure,
          product_service_description: planData.product_service_description,
          marketing_strategy: planData.marketing_strategy,
          sales_strategy: planData.sales_strategy,
          financial_projections: planData.financial_projections,
          funding_requirements: planData.funding_requirements,
          exit_strategy: planData.exit_strategy,
          business_score: Math.round(Number(planData.business_score)),
          risk_level: riskLevel,
          growth_potential: growthPotential,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (saveError) throw saveError
      return savedPlan as BusinessPlan
    },
    onSuccess: (newPlan) => {
      queryClient.setQueryData(['business-plans', newPlan.idea_id], 
        (old: BusinessPlan[] = []) => [newPlan, ...old]
      )
    }
  })

  const updateBusinessPlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BusinessPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('business_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as BusinessPlan
    },
    onSuccess: (updatedPlan) => {
      queryClient.setQueryData(['business-plans', updatedPlan.idea_id], 
        (old: BusinessPlan[] = []) => old.map(plan => 
          plan.id === updatedPlan.id ? updatedPlan : plan
        )
      )
    }
  })

  const deleteBusinessPlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['business-plans'], 
        (old: BusinessPlan[] = []) => old.filter(plan => plan.id !== id)
      )
    }
  })

  return {
    businessPlans,
    isLoading,
    error,
    generateBusinessPlan,
    updateBusinessPlan,
    deleteBusinessPlan
  }
}