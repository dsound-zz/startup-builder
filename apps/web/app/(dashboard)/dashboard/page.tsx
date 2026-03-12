import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, Lightbulb, TrendingUp, Zap } from 'lucide-react'

export default function DashboardPage() {
   const features = [
      {
         title: 'Projects',
         description: 'Manage your startup projects',
         icon: FolderKanban,
         href: '/projects',
      },
      {
         title: 'Idea Generation',
         description: 'AI-powered idea generation',
         icon: Lightbulb,
         href: '/ideas',
      },
      {
         title: 'Market Analysis',
         description: 'Analyze market opportunities',
         icon: TrendingUp,
         href: '/analysis',
      },
      {
         title: 'Validation',
         description: 'Validate your ideas',
         icon: Zap,
         href: '/validation',
      },
   ]

   return (
      <PageContainer
         title="Dashboard"
         description="Welcome to Startup Builder - Your AI-powered startup validation platform"
      >
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
               const Icon = feature.icon
               return (
                  <Card key={feature.title} className="cursor-pointer hover:bg-muted/50 transition-colors">
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">{feature.title}</CardTitle>
                           <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                     </CardHeader>
                  </Card>
               )
            })}
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Getting Started</CardTitle>
               <CardDescription>
                  Start by creating your first project to organize your startup ideas
               </CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">
                  Projects help you organize and validate multiple startup ideas. Each project can
                  contain multiple ideas with detailed analysis, market research, and validation steps.
               </p>
            </CardContent>
         </Card>
      </PageContainer>
   )
}