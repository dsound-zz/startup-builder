'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInvestorMatches } from '@/lib/hooks/use-investor-matches'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { useProjects } from '@/lib/hooks/use-projects'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared/empty-state'
import { Users, TrendingUp, DollarSign, Target, CheckCircle } from 'lucide-react'

export default function InvestorMatchesPage() {
   const router = useRouter()
   const [selectedIdeaId, setSelectedIdeaId] = useState<string | ''>('')
   const [isGenerating, setIsGenerating] = useState(false)

   const { projects, isLoading: projectsLoading } = useProjects()
   const { ideas, isLoading: ideasLoading } = useIdeas(selectedIdeaId ? undefined : undefined)
   const { investorMatches, isLoading, error, generateInvestorMatches } = useInvestorMatches(selectedIdeaId || undefined)

   const handleGenerateInvestorMatches = async () => {
      if (!selectedIdeaId) return

      const idea = ideas?.find(i => i.id === selectedIdeaId)
      if (!idea) return

      setIsGenerating(true)
      try {
         await generateInvestorMatches.mutateAsync({
            idea_id: selectedIdeaId,
            idea_data: {
               project_id: idea.project_id,
               title: idea.title,
               description: idea.target_audience,
               problem: idea.problem,
               solution: idea.solution,
               target_market: idea.target_audience,
               unique_value_proposition: idea.unique_value_proposition,
               market_size: idea.market_size || 'Large',
               revenue_model: idea.pricing_strategy || 'Subscription',
            }
         })
         setSelectedIdeaId('')
      } catch (error) {
         console.error('Failed to generate investor matches:', error)
      } finally {
         setIsGenerating(false)
      }
   }

   if (isLoading || projectsLoading || ideasLoading) {
      return (
         <PageContainer title="Investor Matches" description="Find investors who match your startup">
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
         <PageContainer title="Investor Matches" description="Find investors who match your startup">
            <div className="flex items-center justify-center h-64">
               <EmptyState icon={Users} title="Error Loading Investor Matches" description={error.message} />
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer title="Investor Matches" description="Find investors who match your startup">
         <div className="space-y-6">
            {/* Generation Section */}
            <Card>
               <CardHeader>
                  <CardTitle>Find Investor Matches</CardTitle>
                  <CardDescription>Get AI-powered investor matching analysis for your startup idea</CardDescription>
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
                     onClick={handleGenerateInvestorMatches}
                     disabled={!selectedIdeaId || isGenerating || generateInvestorMatches.isPending}
                     className="w-full"
                  >
                     <Users className="w-4 h-4 mr-2" />
                     {isGenerating || generateInvestorMatches.isPending ? 'Analyzing...' : 'Find Investor Matches'}
                  </Button>
               </CardContent>
            </Card>

            {/* Investor Matches List */}
            <div className="grid gap-4 md:grid-cols-2">
               {investorMatches?.map((match) => (
                  <Card
                     key={match.id}
                     className="cursor-pointer hover:shadow-lg transition-shadow"
                     onClick={() => router.push(`/investor-matches/${match.id}`)}
                  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">Investor Match</CardTitle>
                           <Badge variant="outline">{new Date(match.created_at).toLocaleDateString()}</Badge>
                        </div>
                        <CardDescription>
                           {match.investor_interest_level ? (
                              <span className={`font-medium capitalize ${match.investor_interest_level === 'high' || match.investor_interest_level === 'very_high' ? 'text-green-600' : 'text-muted-foreground'}`}>
                                 {match.investor_interest_level} interest
                              </span>
                           ) : 'No data'}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-green-500" />
                           <div className="flex-1">
                              <div className="text-xs text-muted-foreground">Match Score</div>
                              <div className="flex items-center gap-2">
                                 <div className="h-2 flex-1 bg-gray-200 rounded-full">
                                    <div
                                       className="h-full bg-green-500 rounded-full"
                                       style={{ width: `${match.match_score || 50}%` }}
                                    />
                                 </div>
                                 <span className="text-sm font-medium">{match.match_score || '-'}/100</span>
                              </div>
                           </div>
                        </div>

                        {match.matching_reasons && match.matching_reasons.length > 0 && (
                           <div className="space-y-2">
                              <div className="text-sm font-medium flex items-center gap-2">
                                 <CheckCircle className="w-4 h-4 text-blue-500" />
                                 Matching Reasons
                              </div>
                              <ul className="space-y-1">
                                 {match.matching_reasons.slice(0, 2).map((reason, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">
                                       {reason}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                           <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-purple-500" />
                              <div className="flex-1">
                                 <div className="text-xs text-muted-foreground">Funding Stage</div>
                                 <div className="text-sm font-medium">{match.funding_stage || 'N/A'}</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-orange-500" />
                              <div className="flex-1">
                                 <div className="text-xs text-muted-foreground">Valuation Range</div>
                                 <div className="text-sm font-medium truncate">{match.potential_valuation_range || 'N/A'}</div>
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

               {(!investorMatches || investorMatches.length === 0) && (
                  <div className="col-span-full">
                     <EmptyState
                        icon={Users}
                        title="No Investor Matches Yet"
                        description="Generate investor matches for your startup idea to get started."
                        action={{ label: 'Find Investor Matches', onClick: () => { } }}
                     />
                  </div>
               )}
            </div>
         </div>
      </PageContainer>
   )
}