'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { ArrowLeft, CheckCircle, Clock, Target, TrendingUp, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function IdeaDetailPage() {
   const router = useRouter()
   const { id } = useParams()
   const { ideas, validateIdea } = useIdeas()
   const [idea, setIdea] = useState<any>(null)
   const [isValidating, setIsValidating] = useState(false)

   useEffect(() => {
      if (ideas && id) {
         const foundIdea = ideas.find((idea: any) => idea.id === id)
         if (foundIdea) {
            setIdea(foundIdea)
         }
      }
   }, [ideas, id])

   const handleValidateIdea = async () => {
      if (!idea) return

      setIsValidating(true)
      try {
         await validateIdea.mutateAsync(idea.id)
         // Refresh the idea from the hook
         if (ideas) {
            const updatedIdea = ideas.find((i: any) => i.id === idea.id)
            if (updatedIdea) {
               setIdea(updatedIdea)
            }
         }
      } catch (error) {
         console.error('Failed to validate idea:', error)
      } finally {
         setIsValidating(false)
      }
   }

   if (!idea) {
      return (
         <PageContainer
            title="Loading Idea..."
            description="Please wait while we load the idea details"
         >
            <div className="animate-pulse space-y-4">
               <div className="h-8 bg-muted rounded w-1/3" />
               <div className="h-4 bg-muted rounded w-2/3" />
               <div className="h-32 bg-muted rounded" />
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title={idea.title}
         description="View and validate your startup idea"
         action={
            <Button onClick={() => router.push('/ideas')} variant="outline">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Ideas
            </Button>
         }
      >
         <div className="grid gap-6 lg:grid-cols-2">
            {/* Idea Details */}
            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-2xl">{idea.title}</CardTitle>
                        <Badge variant={idea.status === 'validated' ? 'default' : 'secondary'}>
                           {idea.status}
                        </Badge>
                     </div>
                     <CardDescription>
                        Created {formatDistanceToNow(new Date(idea.created_at), { addSuffix: true })}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <h3 className="font-semibold mb-2">Problem</h3>
                        <p className="text-sm text-muted-foreground">{idea.problem}</p>
                     </div>
                     <div>
                        <h3 className="font-semibold mb-2">Solution</h3>
                        <p className="text-sm text-muted-foreground">{idea.solution}</p>
                     </div>
                     <div>
                        <h3 className="font-semibold mb-2">Unique Value Proposition</h3>
                        <p className="text-sm text-muted-foreground">{idea.unique_value_proposition}</p>
                     </div>
                  </CardContent>
               </Card>

               {/* Market & Audience */}
               <Card>
                  <CardHeader>
                     <CardTitle>Market & Audience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center">
                        <Target className="mr-3 h-5 w-5 text-muted-foreground" />
                        <div>
                           <p className="font-medium">Target Audience</p>
                           <p className="text-sm text-muted-foreground">{idea.target_audience}</p>
                        </div>
                     </div>
                     {idea.market_size && (
                        <div className="flex items-center">
                           <TrendingUp className="mr-3 h-5 w-5 text-muted-foreground" />
                           <div>
                              <p className="font-medium">Market Size</p>
                              <p className="text-sm text-muted-foreground">{idea.market_size}</p>
                           </div>
                        </div>
                     )}
                     {idea.revenue_model && (
                        <div className="flex items-center">
                           <Zap className="mr-3 h-5 w-5 text-muted-foreground" />
                           <div>
                              <p className="font-medium">Revenue Model</p>
                              <p className="text-sm text-muted-foreground">{idea.revenue_model}</p>
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Validation */}
            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Idea Validation</CardTitle>
                     {idea.score !== null && (
                        <CardDescription>
                           AI Validation Score: <span className="font-semibold">{idea.score}/100</span>
                        </CardDescription>
                     )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {idea.status !== 'validated' ? (
                        <div className="text-center">
                           <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                           <p className="text-sm text-muted-foreground mb-4">
                              Validate this idea with AI-powered analysis
                           </p>
                           <Button
                              onClick={handleValidateIdea}
                              disabled={isValidating}
                              className="w-full"
                           >
                              {isValidating ? (
                                 <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Validating...
                                 </>
                              ) : (
                                 <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Validate Idea
                                 </>
                              )}
                           </Button>
                        </div>
                     ) : (
                        <div className="text-center">
                           <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                           <div className="text-4xl font-bold text-green-600 mb-2">{idea.score}</div>
                           <p className="text-sm text-muted-foreground">
                              Validated {formatDistanceToNow(new Date(idea.updated_at), { addSuffix: true })}
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </PageContainer>
   )
}