'use client'

import { useParams, useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, Target, Zap, AlertTriangle } from 'lucide-react'

export default function MarketAnalysisDetailPage() {
   const router = useRouter()
   const { id } = useParams()

   // Mock data - in real implementation, use useMarketAnalysis hook
   const analysis = {
      id,
      total_addressable_market: '$5B',
      serviceable_addressable_market: '$1.2B',
      serviceable_obtainable_market: '$150M',
      competitors: [
         { name: 'Competitor A', market_share: '25%', description: 'Leading player' },
         { name: 'Competitor B', market_share: '15%', description: 'Fast-growing startup' }
      ],
      competition_level: 'high',
      competitive_advantages: ['Innovative technology', 'Better UX', 'Lower pricing'],
      market_growth_rate: '20% CAGR',
      market_trends: ['AI demand', 'Cloud services', 'Data privacy'],
      emerging_opportunities: ['Emerging markets', 'IoT integration', 'Partnerships'],
      market_risks: ['Economic downturn', 'Regulatory changes', 'Tech disruption'],
      market_score: 78
   }

   return (
      <PageContainer
         title="Market Analysis"
         description="Detailed market analysis for your startup idea"
         action={
            <Button onClick={() => router.push('/market-analysis')} variant="outline">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Analyses
            </Button>
         }
      >
         <div className="space-y-6">
            {/* Market Sizing */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Market Sizing
                  </CardTitle>
                  <CardDescription>Market opportunity analysis</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">TAM</h4>
                        <p className="text-2xl font-bold">{analysis.total_addressable_market}</p>
                     </div>
                     <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">SAM</h4>
                        <p className="text-2xl font-bold">{analysis.serviceable_addressable_market}</p>
                     </div>
                     <div className="border rounded-lg p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">SOM</h4>
                        <p className="text-2xl font-bold">{analysis.serviceable_obtainable_market}</p>
                     </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-sm font-medium">Market Growth Rate</span>
                     <Badge variant="secondary">{analysis.market_growth_rate}</Badge>
                  </div>
               </CardContent>
            </Card>

            {/* Competition */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Zap className="mr-2 h-5 w-5" />
                     Competition Analysis
                  </CardTitle>
                  <CardDescription>Key competitors and positioning</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="font-medium">Competition Level</span>
                     <Badge variant="destructive">{analysis.competition_level}</Badge>
                  </div>
                  <div className="space-y-3">
                     {analysis.competitors.map((comp, i) => (
                        <div key={i} className="border rounded-lg p-3">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h5 className="font-medium">{comp.name}</h5>
                                 <p className="text-sm text-muted-foreground">{comp.description}</p>
                              </div>
                              <Badge variant="outline">{comp.market_share}</Badge>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="mt-4">
                     <h4 className="font-medium mb-2">Your Competitive Advantages</h4>
                     <ul className="space-y-1">
                        {analysis.competitive_advantages.map((adv, i) => (
                           <li key={i} className="flex items-start text-sm">
                              <span className="text-green-500 mr-2">✓</span>
                              <span>{adv}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </CardContent>
            </Card>

            {/* Trends & Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Market Trends
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ul className="space-y-2">
                        {analysis.market_trends.map((trend, i) => (
                           <li key={i} className="flex items-start text-sm">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{trend}</span>
                           </li>
                        ))}
                     </ul>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Market Risks
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ul className="space-y-2">
                        {analysis.market_risks.map((risk, i) => (
                           <li key={i} className="flex items-start text-sm">
                              <span className="text-red-500 mr-2">•</span>
                              <span>{risk}</span>
                           </li>
                        ))}
                     </ul>
                  </CardContent>
               </Card>
            </div>

            {/* Market Score */}
            <Card>
               <CardHeader>
                  <CardTitle>Market Attractiveness Score</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-center">
                     <div className="text-5xl font-bold text-green-600 mb-2">
                        {analysis.market_score}
                     </div>
                     <p className="text-sm text-muted-foreground">Out of 100</p>
                  </div>
               </CardContent>
            </Card>
         </div>
      </PageContainer>
   )
}
