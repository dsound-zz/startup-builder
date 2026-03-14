'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Lightbulb, TrendingUp, Zap, Target } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      title: 'AI-Generated Startup Ideas',
      description: 'Generate innovative startup ideas based on emerging trends and market gaps',
      icon: Sparkles,
    },
    {
      title: 'Market Analysis',
      description: 'Real-time market sizing, competition analysis, and growth potential',
      icon: TrendingUp,
    },
    {
      title: 'Business Plan Generator',
      description: 'Create comprehensive pitch decks, financial projections, and MVP roadmaps',
      icon: Lightbulb,
    },
    {
      title: 'Tech Stack Recommender',
      description: 'Get optimal technology recommendations based on your startup idea',
      icon: Zap,
    },
    {
      title: 'Investor Matching',
      description: 'Find VCs and angels who fund similar companies in your industry',
      icon: Target,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Startup Builder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your AI-powered startup validation platform. Turn ideas into validated businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signin')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Ready to Build Your Startup?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of entrepreneurs who use Startup Builder to validate their ideas
              and build successful businesses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              onClick={() => router.push('/signin')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Building Free
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
