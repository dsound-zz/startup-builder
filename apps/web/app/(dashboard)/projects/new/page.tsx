'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProjects } from '@/lib/hooks/use-projects'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
   const router = useRouter()
   const { createProject } = useProjects()
   const [name, setName] = useState('')
   const [description, setDescription] = useState('')
   const [loading, setLoading] = useState(false)

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)

      try {
         await createProject.mutateAsync({
            name,
            description: description || undefined,
         })
         router.push('/projects')
      } catch (error) {
         console.error('Failed to create project:', error)
         alert('Failed to create project. Please try again.')
      } finally {
         setLoading(false)
      }
   }

   return (
      <PageContainer
         title="Create Project"
         description="Start a new project to organize your startup ideas"
         action={
            <Button variant="outline" onClick={() => router.back()}>
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back
            </Button>
         }
      >
         <Card className="max-w-2xl">
            <CardHeader>
               <CardTitle>Project Details</CardTitle>
               <CardDescription>
                  Give your project a name and description to get started
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="name">Project Name *</Label>
                     <Input
                        id="name"
                        placeholder="My Awesome Startup"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required
                        disabled={loading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <textarea
                        id="description"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:1px-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe what this project is about..."
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        disabled={loading}
                     />
                     <p className="text-sm text-muted-foreground">
                        Optional: Add a brief description of your project
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <Button type="submit" disabled={loading || !name.trim()}>
                        {loading ? 'Creating...' : 'Create Project'}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                     >
                        Cancel
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </PageContainer>
   )
}