'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { useProjects } from '@/lib/hooks/use-projects'
import { TrendingUp } from 'lucide-react'

export default function MarketAnalysisPage() {
   const router = useRouter()
   const { projects } = useProjects()
   const [selectedProjectId, setSelectedProjectId] = useState('')

   // In a real implementation, we would fetch market analyses from a hook
   // For now, we'll show a placeholder UI

   const handleAnalyzeMarket = () => {
      if (!selectedProjectId) return
      // Navigate to ideas page for the selected project where they can generate ideas
      // and then analyze the market for each idea
      router.push(`/projects/${selectedProjectId}/ideas`)
   }

   return (
      <PageContainer
         title="Market Analysis"
         description="Analyze market opportunities for your startup ideas"
      >
         <Card className="mb-8">
            <CardHeader>
               <CardTitle>Market Analysis</CardTitle>
               <CardDescription>
                  Select a project to view market analyses for your ideas
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {projects && projects.length > 0 && (
                  <div className="space-y-2">
                     <label htmlFor="project" className="text-sm font-medium">
                        Select Project
                     </label>
                     <select
                        id="project"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
               <Button
                  onClick={handleAnalyzeMarket}
                  disabled={!selectedProjectId}
                  className="w-full"
               >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Market for Project Ideas
               </Button>
            </CardContent>
         </Card>

         <EmptyState
            icon={TrendingUp}
            title="No Market Analyses Yet"
            description="Select a project and generate ideas to begin market analysis"
            action={{
               label: 'View Projects',
               onClick: () => router.push('/projects'),
            }}
         />
      </PageContainer>
   )
}