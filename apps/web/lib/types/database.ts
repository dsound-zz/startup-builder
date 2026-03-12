export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  project_id: string
  title: string
  problem: string
  solution: string
  target_audience: string
  unique_value_proposition: string
  market_size: string | null
  competitors: any[]
  competitive_advantage: string | null
  revenue_streams: any[]
  pricing_strategy: string | null
  key_metrics: any[]
  mvp_features: any[]
  technical_requirements: string | null
  team_requirements: string | null
  timeline: string | null
  budget_estimate: string | null
  risks: any[]
  validation_steps: any[]
  status: 'draft' | 'in_progress' | 'validated' | 'rejected'
  score: number | null
  tags: any[]
  created_at: string
  updated_at: string
}