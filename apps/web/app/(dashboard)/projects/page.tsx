'use client'

import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { useProjects } from '@/lib/hooks/use-projects'
import { FolderKanban, Plus, Calendar, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ProjectsPage() {
   const router = useRouter()
   const { projects, isLoading, deleteProject } = useProjects()

   const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this project?')) {
         await deleteProject.mutateAsync(id)
      }
   }

   if (isLoading) {
      return (
         <PageContainer title="Projects" description="Manage your startup projects">
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                  <Card key={i}>
                     <CardHeader className="animate-pulse">
                        <div className="h-6 bg-muted rounded w-1/3" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                     </CardHeader>
                  </Card>
               ))}
            </div>
         </PageContainer>
      )
   }

   return (
      <PageContainer
         title="Projects"
         description="Organize and manage your startup ideas"
         action={
            <Button onClick={() => router.push('/projects/new')}>
               <Plus className="mr-2 h-4 w-4" />
               New Project
            </Button>
         }
      >
         {!projects || projects.length === 0 ? (
            <EmptyState
               icon={FolderKanban}
               title="No projects yet"
               description="Create your first project to start organizing your startup ideas"
               action={{
                  label: 'Create Project',
                  onClick: () => router.push('/projects/new'),
               }}
            />
         ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                     <CardHeader>
                        <div className="flex items-start justify-between">
                           <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                              <CardDescription className="line-clamp-2">
                                 {project.description || 'No description'}
                              </CardDescription>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                              className="text-destructive hover:text-destructive"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground">
                           <Calendar className="mr-2 h-4 w-4" />
                           Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </PageContainer>
   )
}