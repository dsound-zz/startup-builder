'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, TrendingUp, Target, DollarSign, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { InvestorMatch } from '@/lib/types/database'

export default function InvestorMatchDetailPage() {
   const { id } = useParams()
   const router = useRouter()
   const [match, setMatch] = useState<InvestorMatch | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchMatch = async () => {
         try {
            const supabase = createClient()
            const { data, error: fetchError } = await supabase
               .from('investor_matches')
               .select('*')
               .eq('id', id as string)
               .single()

            if (fetchError) {
               setError(fetchError.message)
            } else {
               setMatch(data)
            }
         } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch investor match')
         } finally {
            setIsLoading(false)
         }
      }

      if (id) {
         fetchMatch()
      }
   }, [id])

   if (isLoading) {
      return (
         <PageContainer title="Investor Match Details" description="Loading investor match details">
            <div className="flex items-center justify-center h-64">
               <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
         </PageContainer>
      )
   }

   if (error || !match) {
      return (
         <PageContainer title="Investor Match Details" description="Investor match not found">
            <div className="flex flex-col items-center justify-center h-64 text-center">
               <p className="text-muted-foreground mb-4">Investor match not found</p>
               <Button onClick={() => router.push('/investor-matches')} variant="outline">
                  Back to Investor Matches
               </Button>
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title="Investor Match Analysis"
         description="Detailed investor matching analysis for your startup idea"
         action={
            <Button onClick={() => router.push('/investor-matches')} variant="outline">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Investor Matches
            </Button>
         }
      >
         <div className="space-y-6">
            {/* Overview Card */}
            <Card>
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-2xl">Match Analysis</CardTitle>
                        <CardDescription>
                           AI-powered investor matching results
                        </CardDescription>
                     </div>
                     <Badge variant="outline" className="text-lg px-3 py-1">
                        {match.match_score}/100
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center">
                           <Target className="mr-1 h-4 w-4" />
                           Funding Stage
                        </p>
                        <p className="text-lg font-semibold capitalize">{match.funding_stage || 'N/A'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center">
                           <DollarSign className="mr-1 h-4 w-4" />
                           Valuation Range
                        </p>
                        <p className="text-lg font-semibold">{match.potential_valuation_range || 'N/A'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground flex items-center">
                           <TrendingUp className="mr-1 h-4 w-4" />
                           Interest Level
                        </p>
                        <p className="text-lg font-semibold capitalize">{match.investor_interest_level || 'N/A'}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Matching Reasons */}
            {match.matching_reasons && match.matching_reasons.length > 0 && (
               <Card>
                  <CardHeader>
                     <CardTitle>Why These Investors Match</CardTitle>
                     <CardDescription>
                        Key reasons these investors are a good fit
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <ul className="space-y-2">
                        {match.matching_reasons.map((reason: string, i: number) => (
                           <li key={i} className="flex items-start">
                              <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{reason}</span>
                           </li>
                        ))}
                     </ul>
                  </CardContent>
               </Card>
            )}

            {/* Competitive Advantage */}
            {match.competitive_advantage && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Competitive Advantage
                     </CardTitle>
                     <CardDescription>
                        Your startup's unique competitive advantages
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground">{match.competitive_advantage}</p>
                  </CardContent>
               </Card>
            )}

            {/* Market Differentiators */}
            {match.market_differentiators && match.market_differentiators.length > 0 && (
               <Card>
                  <CardHeader>
                     <CardTitle>Market Differentiators</CardTitle>
                     <CardDescription>
                        What sets your startup apart in the market
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-wrap gap-2">
                        {match.market_differentiators.map((diff: string, i: number) => (
                           <Badge key={i} variant="secondary">
                              {diff}
                           </Badge>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Matched Investors */}
            {match.investor_profiles && match.investor_profiles.length > 0 && (
               <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Matched Investors ({match.investor_profiles.length})</h3>
                  {match.investor_profiles.map((investor, index) => (
                     <Card key={index}>
                        <CardHeader>
                           <div className="flex items-center justify-between">
                              <div>
                                 <CardTitle className="flex items-center">
                                    <Building2 className="mr-2 h-5 w-5" />
                                    {investor.name}
                                 </CardTitle>
                                 <CardDescription className="capitalize">
                                    {investor.type}
                                 </CardDescription>
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {/* Investment Range */}
                           <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Investment Range</p>
                              <p className="text-base">{investor.investment_range}</p>
                           </div>

                           {/* Focus Areas */}
                           {investor.focus && investor.focus.length > 0 && (
                              <div className="space-y-2">
                                 <p className="text-sm font-medium text-muted-foreground">Focus Areas</p>
                                 <div className="flex flex-wrap gap-2">
                                    {investor.focus.map((area, i) => (
                                       <Badge key={i} variant="outline">
                                          {area}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Investment Stage */}
                           {investor.stage && investor.stage.length > 0 && (
                              <div className="space-y-2">
                                 <p className="text-sm font-medium text-muted-foreground">Investment Stage</p>
                                 <div className="flex flex-wrap gap-2">
                                    {investor.stage.map((stage, i) => (
                                       <Badge key={i} variant="secondary">
                                          {stage}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Portfolio Companies */}
                           {investor.portfolio_companies && investor.portfolio_companies.length > 0 && (
                              <div className="space-y-2">
                                 <p className="text-sm font-medium text-muted-foreground">Notable Portfolio Companies</p>
                                 <div className="flex flex-wrap gap-2">
                                    {investor.portfolio_companies.slice(0, 5).map((company, i) => (
                                       <Badge key={i} variant="outline" className="text-xs">
                                          {company}
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Investment Thesis */}
                           {investor.why_they_invest && (
                              <div className="space-y-1">
                                 <p className="text-sm font-medium text-muted-foreground">Investment Thesis</p>
                                 <p className="text-sm text-muted-foreground">{investor.why_they_invest}</p>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>
      </PageContainer>
   )
}
