'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTechStack } from '@/lib/hooks/use-tech-stack'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { useProjects } from '@/lib/hooks/use-projects'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { Code, Database, Server, Target, Zap } from 'lucide-react'

export default function TechStackPage() {
   const router = useRouter()
   const [selectedIdeaId, setSelectedIdeaId] = useState<string | ''>('')

   const { projects, isLoading: projectsLoading } = useProjects()
   const { ideas, isLoading: ideasLoading } = useIdeas(selectedIdeaId ? undefined : undefined)
   const { techStacks, isLoading, error, recommendTechStack } = useTechStack(undefined, selectedIdeaId || undefined)

   const handleRecommendTechStack = async () => {
      if (!selectedIdeaId) return

      const idea = ideas?.find(i => i.id === selectedIdeaId)
      if (!idea) return

      setIsRecommending(true)
      try {
         await recommendTechStack.mutateAsync({
            project_id: idea.project_id,
            idea_id: selectedIdeaId,
            idea_details: {
               title: idea.title,
               problem: idea.problem,
               solution: idea.solution,
               target_audience: idea.target_audience,
               unique_value_proposition: idea.unique_value_proposition,
            }
         })
         setSelectedIdeaId('')
      } catch (error) {
         console.error('Failed to recommend tech stack:', error)
      } finally {
         setIsRecommending(false)
      }
   }

   const [isRecommending, setIsRecommending] = useState(false)

   if (isLoading || projectsLoading || ideasLoading) {
      return (
         <PageContainer title="Tech Stack Recommendations" description="Get AI-powered tech stack recommendations">
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
         <PageContainer title="Tech Stack Recommendations" description="Get AI-powered tech stack recommendations">
            <div className="flex items-center justify-center h-64">
               <EmptyState icon={Zap} title="Error Loading Tech Stacks" description={error.message} />
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer title="Tech Stack Recommendations" description="Get AI-powered tech stack recommendations">
         <div className="space-y-6">
            {/* Recommendation Section */}
            <Card>
               <CardHeader>
                  <CardTitle>Get Tech Stack Recommendation</CardTitle>
                  <CardDescription>Get AI-powered recommendations for your startup's technology stack</CardDescription>
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
                     onClick={handleRecommendTechStack}
                     disabled={!selectedIdeaId || isRecommending || recommendTechStack.isPending}
                     className="w-full"
                  >
                     <Code className="w-4 h-4 mr-2" />
                     {isRecommending || recommendTechStack.isPending ? 'Analyzing...' : 'Get Tech Stack Recommendation'}
                  </Button>
               </CardContent>
            </Card>

            {/* Tech Stacks List */}
            <div className="grid gap-4 md:grid-cols-2">
               {techStacks?.map((stack) => (
                  <Card
                     key={stack.id}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => router.push(`/tech-stack/${stack.id}`)}
                  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">Tech Stack</CardTitle>
                           <Badge variant="outline">{new Date(stack.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>
                           {stack.complexity_level} complexity • {stack.confidence_score}/100 confidence
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                           <Target className="w-4 h-4 text-blue-500" />
                           <div className="flex-1">
                              <div className="text-xs text-muted-foreground">Confidence Score</div>
                              <div className="flex items-center gap-2">
                                 <div className="h-2 flex-1 bg-gray-200 rounded-full">
                                    <div
                                       className="h-full bg-blue-500 rounded-full"
                                       style={{ width: `${stack.confidence_score}%` }}
                                    />
                                 </div>
                                 <span className="text-sm font-medium">{stack.confidence_score}/100</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="text-sm font-medium">Recommended Stack:</div>
                           <div className="p-3 bg-muted rounded-md text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                 <Code className="w-3 h-3" />
                                 <span>Frontend: {stack.frontend_framework?.recommendation || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                 <Code className="w-3 h-3" />
                                 <span>Backend: {stack.backend_framework?.recommendation || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-1">
                                 <Database className="w-3 h-3" />
                                 <span>Database: {stack.database?.recommendation || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Server className="w-3 h-3" />
                                 <span>Infra: {stack.infrastructure?.recommendation || 'N/A'}</span>
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

               {(!techStacks || techStacks.length === 0) && (
                  <div className="col-span-full">
                     <EmptyState
                        icon={Code}
                        title="No Tech Stacks Yet"
                        description="Get a tech stack recommendation for your startup idea to get started."
                        action={{ label: 'Get Recommendation', onClick: () => { } }}
                     />
                  </div>
               )}
            </div>
         </div>
      </PageContainer>
   )
}