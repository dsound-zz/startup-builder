'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBusinessPlan } from '@/lib/hooks/use-business-plan'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { useProjects } from '@/lib/hooks/use-projects'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { Sparkles, FileText, TrendingUp, Target, AlertTriangle } from 'lucide-react'

export default function BusinessPlanPage() {
   const router = useRouter()
   const [selectedIdeaId, setSelectedIdeaId] = useState<string | ''>('')

   const { projects, isLoading: projectsLoading } = useProjects()
   const { ideas, isLoading: ideasLoading } = useIdeas(selectedIdeaId ? undefined : undefined)
   const { businessPlans, isLoading, error, generateBusinessPlan } = useBusinessPlan(selectedIdeaId || undefined)

   const handleGenerateBusinessPlan = async () => {
      if (!selectedIdeaId) return

      const idea = ideas?.find(i => i.id === selectedIdeaId)
      if (!idea) return

      setIsGenerating(true)
      try {
         await generateBusinessPlan.mutateAsync({
            idea_id: selectedIdeaId,
            idea_data: {
               project_id: idea.project_id,
               title: idea.title,
               description: idea.target_audience,
               problem: idea.problem,
               solution: idea.solution,
               target_market: idea.target_audience,
               unique_value_proposition: idea.unique_value_proposition,
            }
         })
         setSelectedIdeaId('')
      } catch (error) {
         console.error('Failed to generate business plan:', error)
      } finally {
         setIsGenerating(false)
      }
   }

   const [isGenerating, setIsGenerating] = useState(false)

   if (isLoading || projectsLoading || ideasLoading) {
      return (
         <PageContainer title="Business Plans" description="View and manage your generated business plans">
            <div className="flex items-center justify-center h-64">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading...</p>
               </div>
            </div>
         </PageContainer>
      )
   }

   if (error) {
      return (
         <PageContainer title="Business Plans" description="View and manage your generated business plans">
            <div className="flex items-center justify-center h-64">
               <EmptyState icon={AlertTriangle} title="Error Loading Business Plans" description={error.message} />
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer title="Business Plans" description="View and manage your generated business plans">
         <div className="space-y-6">
            {/* Generation Section */}
            <Card>
               <CardHeader>
                  <CardTitle>Generate Business Plan</CardTitle>
                  <CardDescription>Create a comprehensive business plan for your startup idea using AI</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Select Idea</label>
                     <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedIdeaId}
                        onChange={(e) => setSelectedIdeaId(e.target.value)}
                     >
                        <option value="">Choose an idea...</option>
                        {ideas?.map((idea) => (
                           <option key={idea.id} value={idea.id}>
                              {idea.title}
                           </option>
                        ))}
                     </select>
                  </div>

                  {selectedIdeaId && ideas?.find(i => i.id === selectedIdeaId) && (
                     <div className="p-4 bg-muted rounded-md">
                        <h4 className="font-medium mb-2">Selected Idea</h4>
                        <p className="text-sm text-muted-foreground">
                           {ideas.find(i => i.id === selectedIdeaId)?.target_audience}
                        </p>
                     </div>
                  )}

                  <Button
                     onClick={handleGenerateBusinessPlan}
                     disabled={!selectedIdeaId || isGenerating || generateBusinessPlan.isPending}
                     className="w-full"
                  >
                     <Sparkles className="w-4 h-4 mr-2" />
                     {isGenerating || generateBusinessPlan.isPending ? 'Generating...' : 'Generate Business Plan'}
                  </Button>
               </CardContent>
            </Card>

            {/* Business Plans List */}
            <div className="grid gap-4 md:grid-cols-2">
               {businessPlans?.map((plan) => (
                  <Card
                     key={plan.id}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => router.push(`/business-plan/${plan.id}`)}
                  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">Business Plan</CardTitle>
                           <Badge variant="outline">{new Date(plan.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>
                           Generated on {new Date(plan.created_at).toLocaleString()}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-green-500" />
                           <div className="flex-1">
                              <div className="text-xs text-muted-foreground">Business Score</div>
                              <div className="flex items-center gap-2">
                                 <div className="h-2 flex-1 bg-gray-200 rounded-full">
                                    <div
                                       className="h-full bg-green-500 rounded-full"
                                       style={{ width: `${plan.business_score || 50}%` }}
                                    />
                                 </div>
                                 <span className="text-sm font-medium">{plan.business_score || '-'}/100</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                           <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              <div className="flex-1">
                                 <div className="text-xs text-muted-foreground">Risk Level</div>
                                 <div className="text-sm font-medium capitalize">{plan.risk_level || 'Not assessed'}</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-purple-500" />
                              <div className="flex-1">
                                 <div className="text-xs text-muted-foreground">Growth Potential</div>
                                 <div className="text-sm font-medium capitalize">{plan.growth_potential || 'Not assessed'}</div>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">
                           View Details
                        </Button>
                     </CardFooter>
                  </Card>
               ))}

               {(!businessPlans || businessPlans.length === 0) && (
                  <div className="col-span-full">
                     <EmptyState
                        icon={FileText}
                        title="No Business Plans Yet"
                        description="Generate a business plan for your startup idea to get started."
                        action={{ label: 'Generate Business Plan', onClick: () => { } }}
                     />
                  </div>
               )}
            </div>
         </div>
      </PageContainer>
   )
}