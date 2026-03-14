'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/shared/empty-state'
import { useIdeas } from '@/lib/hooks/use-ideas'
import { useProjects } from '@/lib/hooks/use-projects'
import { Lightbulb, Sparkles, Target, TrendingUp, Zap } from 'lucide-react'

export default function IdeasPage() {
   const router = useRouter()
   const { projects, isLoading: projectsLoading } = useProjects()
   const { generateIdeas } = useIdeas()
   const [isGenerating, setIsGenerating] = useState(false)
   const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([])
   const [context, setContext] = useState('')
   const [selectedProjectId, setSelectedProjectId] = useState('')

   const handleGenerateIdeas = async () => {
      if (!context.trim() || !selectedProjectId) return

      setIsGenerating(true)
      setGeneratedIdeas([])

      try {
         const newIdeas = await generateIdeas.mutateAsync({
            project_id: selectedProjectId,
            context: context
         })

         setGeneratedIdeas(newIdeas)
      } catch (error) {
         console.error('Failed to generate ideas:', error)
      } finally {
         setIsGenerating(false)
      }
   }

   const handleIdeaClick = (ideaId: string) => {
      router.push(`/ideas/${ideaId}`)
   }

   return (
      <PageContainer
         title="Idea Generation"
         description="Generate and validate innovative startup ideas"
         action={
            <Button onClick={() => router.push('/projects')} variant="outline">
               Back to Projects
            </Button>
         }
      >
         {/* Idea Generation Form */}
         <Card className="mb-8">
            <CardHeader>
               <CardTitle>Generate New Ideas</CardTitle>
               <CardDescription>
                  Describe your project or area of interest to generate AI-powered startup ideas
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {projects && projects.length > 0 && (
                  <div className="space-y-2">
                     <Label htmlFor="project">Select Project</Label>
                     <select
                        id="project"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                     >
                        <option value="">Select a project...</option>
                        {projects.map((project) => (
                           <option key={project.id} value={project.id}>
                              {project.name}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
               <div className="space-y-2">
                  <Label htmlFor="context">Project Context</Label>
                  <textarea
                     id="context"
                     placeholder="Describe your project, industry, or area of interest..."
                     value={context}
                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContext(e.target.value)}
                     rows={3}
                     className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allow ed:opacity-50"
                  />
               </div>
               <Button
                  onClick={handleGenerateIdeas}
                  disabled={isGenerating || !context.trim() || !selectedProjectId}
                  className="w-full"
               >
                  {isGenerating ? (
                     <>
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        Generating Ideas...
                     </>
                  ) : (
                     <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Generate Ideas
                     </>
                  )}
               </Button>
            </CardContent>
         </Card>

         {/* Generated Ideas */}
         {generatedIdeas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {generatedIdeas.map((idea) => (
                  <Card
                     key={idea.id}
                     className="cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => handleIdeaClick(idea.id)}
                  >
                     <CardHeader>
                        <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                           {idea.problem}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                           <Target className="mr-2 h-4 w-4" />
                           {idea.target_audience}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                           <TrendingUp className="mr-2 h-4 w-4" />
                           {idea.market_size}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                           <Zap className="mr-2 h-4 w-4" />
                           {idea.revenue_model}
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         ) : (
            <EmptyState
               icon={Lightbulb}
               title="No ideas generated yet"
               description="Select a project and describe your context to generate innovative startup ideas"
               action={{
                  label: 'View Projects',
                  onClick: () => router.push('/projects'),
               }}
            />
         )}
      </PageContainer>
   )
}