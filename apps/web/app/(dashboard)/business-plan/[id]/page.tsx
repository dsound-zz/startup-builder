'use client'

import { useParams, useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Target, Zap, AlertTriangle, Users, DollarSign } from 'lucide-react'

export default function BusinessPlanDetailPage() {
   const router = useRouter()
   const { id } = useParams()

   // Mock data - in real implementation, use useBusinessPlan hook
   const plan = {
      id,
      executive_summary: 'Our startup aims to revolutionize the online education space with an AI-powered learning platform that personalizes education for every student. With a $2B total addressable market and strong growth trends in edtech, we project $5M in revenue within 3 years.',
      company_description: 'LearnAI is a Series A startup focused on AI-powered personalized learning. Our mission is to make education accessible, engaging, and effective for all learners.',
      market_analysis: 'The global edtech market is projected to reach $404B by 2030 with a 22% CAGR. Key segments include K-12, higher education, and corporate training.',
      organization_structure: 'Flat organizational structure with cross-functional teams. Key roles include CTO, CPO, CMO, and Head of Content.',
      product_service_description: 'Our platform features AI-powered tutor matching, adaptive learning paths, real-time progress tracking, and collaborative learning tools.',
      marketing_strategy: 'Multi-channel approach including content marketing, social media, influencer partnerships, and strategic school partnerships.',
      sales_strategy: 'B2B2C model targeting schools and districts first, then expanding to direct-to-consumer for families.',
      financial_projections: 'Year 1: $1.2M revenue, Year 2: $3.5M, Year 3: $7.8M. Projected EBITDA margin of 25% by Year 3.',
      funding_requirements: 'Seeking $2M seed round for product development (40%), marketing (30%), and team expansion (30%).',
      exit_strategy: 'Potential acquisition by major edtech players or strategic acquisition by tech giants expanding in education.',
      business_score: 78,
      risk_level: 'medium',
      growth_potential: 'high',
      created_at: '2024-03-15T10:30:00Z'
   }

   return (
      <PageContainer
         title="Business Plan"
         description="Detailed business plan for your startup idea"
         action={
            <Button onClick={() => router.push('/business-plan')} variant="outline">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Business Plans
            </Button>
         }
      >
         <div className="space-y-6">
            {/* Score Overview */}
            <div className="grid md:grid-cols-3 gap-6">
               <Card>
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Business Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-3xl font-bold">{plan.business_score}</div>
                     <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <Badge variant={plan.risk_level === 'low' ? 'default' : plan.risk_level === 'medium' ? 'secondary' : 'destructive'} className="text-lg">
                        {plan.risk_level}
                     </Badge>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader className="pb-2">
                     <CardTitle className="text-sm font-medium">Growth Potential</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <Badge variant="outline" className="text-lg bg-green-50 text-green-600 border-green-200">
                        {plan.growth_potential}
                     </Badge>
                  </CardContent>
               </Card>
            </div>

            {/* Executive Summary */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <FileText className="mr-2 h-5 w-5" />
                     Executive Summary
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-gray-700 leading-relaxed">{plan.executive_summary}</p>
               </CardContent>
            </Card>

            {/* Company Description */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Company Description
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-gray-700 leading-relaxed">{plan.company_description}</p>
               </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Market Analysis
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{plan.market_analysis}</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                     <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                           <Zap className="w-4 h-4 mr-2" />
                           Marketing Strategy
                        </h4>
                        <p className="text-sm text-muted-foreground">{plan.marketing_strategy}</p>
                     </div>
                     <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                           <Zap className="w-4 h-4 mr-2" />
                           Sales Strategy
                        </h4>
                        <p className="text-sm text-muted-foreground">{plan.sales_strategy}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Products & Services */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Products & Services
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{plan.product_service_description}</p>
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                     <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                           <Users className="w-4 h-4 mr-2" />
                           Organization Structure
                        </h4>
                        <p className="text-sm text-muted-foreground">{plan.organization_structure}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Financials */}
            <div className="grid md:grid-cols-2 gap-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Financial Projections
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                           <span className="font-medium">Year 1</span>
                           <span className="font-bold">{plan.financial_projections}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Funding Requirements
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        <div>
                           <span className="text-sm font-medium">Amount Needed:</span>
                           <p className="text-2xl font-bold text-green-600">{plan.funding_requirements}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Use of funds: Product development (40%), Marketing (30%), Team expansion (30%)
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Exit Strategy */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Exit Strategy
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-gray-700 leading-relaxed">{plan.exit_strategy}</p>
               </CardContent>
            </Card>
         </div>
      </PageContainer>
   )
}