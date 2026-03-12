import { ReactNode } from 'react'

interface PageContainerProps {
   title: string
   description?: string
   action?: ReactNode
   children: ReactNode
}

export function PageContainer({ title, description, action, children }: PageContainerProps) {
   return (
      <div className="flex-1 space-y-4 p-8 pt-6">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
               {description && (
                  <p className="text-muted-foreground">{description}</p>
               )}
            </div>
            {action}
         </div>
         {children}
      </div>
   )
}