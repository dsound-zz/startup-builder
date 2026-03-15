'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer } from '@/components/layout/page-container'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Code, Cpu, Database, Globe, Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { TechStack } from '@/lib/hooks/use-tech-stack'

export default function TechStackDetailPage() {
   const { id } = useParams()
   const router = useRouter()
   const [techStack, setTechStack] = useState<TechStack | null>(null)
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchTechStack = async () => {
         try {
            const supabase = createClient()
            const { data, error: fetchError } = await supabase
               .from('tech_stacks')
               .select('*')
               .eq('id', id as string)
               .single()

            if (fetchError) {
               setError(fetchError.message)
            } else {
               setTechStack(data)
            }
         } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tech stack')
         } finally {
            setIsLoading(false)
         }
      }

      if (id) {
         fetchTechStack()
      }
   }, [id])

   if (isLoading) {
      return (
         <PageContainer title="Tech Stack Details" description="Loading tech stack details">
            <div className="flex items-center justify-center h-64">
               <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
         </PageContainer>
      )
   }

   if (error || !techStack) {
      return (
         <PageContainer title="Tech Stack Details" description="Tech stack not found">
            <div className="flex flex-col items-center justify-center h-64 text-center">
               <p className="text-muted-foreground mb-4">Tech stack not found</p>
               <Button onClick={() => router.push('/tech-stack')} variant="outline">
                  Back to Tech Stack
               </Button>
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title="Tech Stack Details"
         description="Details for recommended tech stack"
         action={
            <Button onClick={() => router.push('/tech-stack')} variant="outline">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Tech Stack
            </Button>
         }
      >
         <div className="space-y-6">
            {/* Overview Card */}
            <Card>
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-2xl">Recommended Tech Stack</CardTitle>
                        <CardDescription>
                           AI-powered recommendations for your project
                        </CardDescription>
                     </div>
                     <Badge variant="outline" className="text-sm">
                        {techStack.confidence_score}/100
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Complexity</p>
                        <p className="text-lg font-semibold capitalize">{techStack.complexity_level}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Cost</p>
                        <p className="text-lg font-semibold">{techStack.estimated_cost}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                        <p className="text-lg font-semibold">{techStack.timeline_estimate}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Frontend Framework */}
            {techStack.frontend_framework && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Code className="mr-2 h-5 w-5" />
                        Frontend Framework
                     </CardTitle>
                     <CardDescription>
                        Recommended frontend technology
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                           <p className="font-medium">{techStack.frontend_framework.recommendation}</p>
                           <p className="text-sm text-muted-foreground mt-1">{techStack.frontend_framework.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                           {techStack.frontend_framework.confidence}%
                        </Badge>
                     </div>
                     {techStack.frontend_framework.alternatives && techStack.frontend_framework.alternatives.length > 0 && (
                        <div>
                           <p className="text-sm font-medium text-muted-foreground mb-2">Alternatives:</p>
                           <div className="flex flex-wrap gap-2">
                              {techStack.frontend_framework.alternatives.map((alt: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-xs">
                                    {alt}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}

            {/* Backend Framework */}
            {techStack.backend_framework && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Cpu className="mr-2 h-5 w-5" />
                        Backend Framework
                     </CardTitle>
                     <CardDescription>
                        Recommended backend technology
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                           <p className="font-medium">{techStack.backend_framework.recommendation}</p>
                           <p className="text-sm text-muted-foreground mt-1">{techStack.backend_framework.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                           {techStack.backend_framework.confidence}%
                        </Badge>
                     </div>
                     {techStack.backend_framework.alternatives && techStack.backend_framework.alternatives.length > 0 && (
                        <div>
                           <p className="text-sm font-medium text-muted-foreground mb-2">Alternatives:</p>
                           <div className="flex flex-wrap gap-2">
                              {techStack.backend_framework.alternatives.map((alt: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-xs">
                                    {alt}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}

            {/* Database */}
            {techStack.database && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        Database
                     </CardTitle>
                     <CardDescription>
                        Recommended database technology
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                           <p className="font-medium">{techStack.database.recommendation}</p>
                           <p className="text-sm text-muted-foreground mt-1">{techStack.database.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                           {techStack.database.confidence}%
                        </Badge>
                     </div>
                     {techStack.database.alternatives && techStack.database.alternatives.length > 0 && (
                        <div>
                           <p className="text-sm font-medium text-muted-foreground mb-2">Alternatives:</p>
                           <div className="flex flex-wrap gap-2">
                              {techStack.database.alternatives.map((alt: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-xs">
                                    {alt}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}

            {/* Infrastructure */}
            {techStack.infrastructure && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Globe className="mr-2 h-5 w-5" />
                        Infrastructure
                     </CardTitle>
                     <CardDescription>
                        Recommended infrastructure
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                           <p className="font-medium">{techStack.infrastructure.recommendation}</p>
                           <p className="text-sm text-muted-foreground mt-1">{techStack.infrastructure.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                           {techStack.infrastructure.confidence}%
                        </Badge>
                     </div>
                     {techStack.infrastructure.alternatives && techStack.infrastructure.alternatives.length > 0 && (
                        <div>
                           <p className="text-sm font-medium text-muted-foreground mb-2">Alternatives:</p>
                           <div className="flex flex-wrap gap-2">
                              {techStack.infrastructure.alternatives.map((alt: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-xs">
                                    {alt}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}

            {/* Tools */}
            {techStack.tools && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center">
                        <Wrench className="mr-2 h-5 w-5" />
                        Development Tools
                     </CardTitle>
                     <CardDescription>
                        Recommended development tools
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                           <p className="font-medium">{techStack.tools.recommendation}</p>
                           <p className="text-sm text-muted-foreground mt-1">{techStack.tools.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                           {techStack.tools.confidence}%
                        </Badge>
                     </div>
                     {techStack.tools.alternatives && techStack.tools.alternatives.length > 0 && (
                        <div>
                           <p className="text-sm font-medium text-muted-foreground mb-2">Alternatives:</p>
                           <div className="flex flex-wrap gap-2">
                              {techStack.tools.alternatives.map((alt: string, i: number) => (
                                 <Badge key={i} variant="outline" className="text-xs">
                                    {alt}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            )}
         </div>
      </PageContainer>
   )
}
