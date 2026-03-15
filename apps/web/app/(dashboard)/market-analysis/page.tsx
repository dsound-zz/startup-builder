'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMarketAnalysis } from '@/lib/hooks/use-market-analysis'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { useProjects } from '@/lib/hooks/use-projects'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { TrendingUp, Users, AlertTriangle } from 'lucide-react'

export default function MarketAnalysisPage() {
   const router = useRouter()
   const [selectedIdeaId, setSelectedIdeaId] = useState<string | ''>('')
   const [isGenerating, setIsGenerating] = useState(false)

   const { projects, isLoading: projectsLoading } = useProjects()
   const { ideas, isLoading: ideasLoading } = useIdeas(selectedIdeaId ? undefined : undefined)
   const { marketAnalyses, isLoading, error, analyzeMarket } = useMarketAnalysis(selectedIdeaId || undefined)

   const handleAnalyzeMarket = async () => {
      if (!selectedIdeaId) return

      const idea = ideas?.find(i => i.id === selectedIdeaId)
      if (!idea) return

      setIsGenerating(true)
      try {
         await analyzeMarket.mutateAsync({
            idea_id: selectedIdeaId,
            idea_data: {
               project_id: idea.project_id,
               title: idea.title,
               problem: idea.problem,
               solution: idea.solution,
               target_market: idea.target_audience,
               unique_value_proposition: idea.unique_value_proposition,
            }
         })
         setSelectedIdeaId('')
      } catch (error) {
         console.error('Failed to analyze market:', error)
      } finally {
         setIsGenerating(false)
      }
   }

   if (isLoading || projectsLoading || ideasLoading) {
      return (
         <PageContainer title="Market Analysis" description="Analyze market opportunities for your startup ideas">
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
         <PageContainer title="Market Analysis" description="Analyze market opportunities for your startup ideas">
            <Card>
               <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                  <p className="text-destructive">Error loading market analyses</p>
                  <Button onClick={() => window.location.reload()} className="mt-4">
                     Retry
                  </Button>
               </CardContent>
            </Card>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title="Market Analysis"
         description="Analyze market opportunities for your startup ideas"
      >
         <div className="space-y-6">
            {/* Generation Form */}
            <Card>
               <CardHeader>
                  <CardTitle>Generate Market Analysis</CardTitle>
                  <CardDescription>
                     Select an idea to analyze market opportunities, competition, and growth potential
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  {ideas && ideas.length > 0 ? (
                     <div className="space-y-2">
                        <label htmlFor="idea" className="text-sm font-medium">
                           Select Idea
                        </label>
                        <select
                           id="idea"
                           value={selectedIdeaId}
                           onChange={(e) => setSelectedIdeaId(e.target.value)}
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                           <option value="">Select an idea...</option>
                           {ideas.map((idea) => (
                              <option key={idea.id} value={idea.id}>
                                 {idea.title}
                              </option>
                           ))}
                        </select>
                     </div>
                  ) : (
                     <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No ideas found. Create some ideas first!</p>
                        <Button onClick={() => router.push('/ideas')} variant="outline">
                           Go to Ideas
                        </Button>
                     </div>
                  )}
                  <Button
                     onClick={handleAnalyzeMarket}
                     disabled={!selectedIdeaId || isGenerating}
                     className="w-full"
                  >
                     {isGenerating ? (
                        <>
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                           Analyzing Market...
                        </>
                     ) : (
                        <>
                           <TrendingUp className="mr-2 h-4 w-4" />
                           Analyze Market
                        </>
                     )}
                  </Button>
               </CardContent>
            </Card>

            {/* Market Analyses List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {marketAnalyses?.map((analysis) => (
                  <Card
                     key={analysis.id}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => router.push(`/market-analysis/${analysis.id}`)}
                  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">Market Analysis</CardTitle>
                           <Badge variant="outline">{new Date(analysis.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>
                           {analysis.competition_level ? `${analysis.competition_level} competition` : 'Analysis complete'}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-green-500" />
                           <div className="flex-1">
                              <div className="text-xs text-muted-foreground">Market Score</div>
                              <div className="flex items-center gap-2">
                                 <div className="h-2 flex-1 bg-gray-200 rounded-full">
                                    <div
                                       className="h-full bg-green-500 rounded-full"
                                       style={{ width: `${analysis.market_score || 50}%` }}
                                    />
                                 </div>
                                 <span className="text-sm font-medium">{analysis.market_score || '-'}/100</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="text-sm font-medium">Market Size:</div>
                           <div className="text-xs text-muted-foreground">
                              TAM: {analysis.total_addressable_market || 'N/A'}
                           </div>
                        </div>

                        {analysis.competitors && analysis.competitors.length > 0 && (
                           <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span className="text-muted-foreground">
                                 {analysis.competitors.length} competitors identified
                              </span>
                           </div>
                        )}
                     </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">
                           View Details
                        </Button>
                     </CardFooter>
                  </Card>
               ))}

               {(!marketAnalyses || marketAnalyses.length === 0) && !isGenerating && (
                  <div className="col-span-full">
                     <EmptyState
                        icon={TrendingUp}
                        title="No Market Analyses Yet"
                        description="Select an idea above and click 'Analyze Market' to get started"
                     />
                  </div>
               )}
            </div>
         </div>
      </PageContainer>
   )
}
