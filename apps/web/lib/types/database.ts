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

export interface MarketAnalysis {
  id: string
  idea_id: string
  project_id: string
  total_addressable_market: string | null
  serviceable_addressable_market: string | null
  serviceable_obtainable_market: string | null
  competitors: any[]
  competition_level: 'low' | 'medium' | 'high' | 'very_high' | null
  competitive_advantages: any[]
  market_growth_rate: string | null
  market_trends: any[]
  emerging_opportunities: any[]
  market_risks: any[]
  regulatory_considerations: string | null
  market_score: number | null
  created_at: string
  updated_at: string
}

export interface BusinessPlan {
  id: string
  idea_id: string
  project_id: string
  executive_summary: string | null
  company_description: string | null
  market_analysis: string | null
  organization_structure: string | null
  product_service_description: string | null
  marketing_strategy: string | null
  sales_strategy: string | null
  financial_projections: string | null
  funding_requirements: string | null
  exit_strategy: string | null
  business_score: number | null
  risk_level: 'low' | 'medium' | 'high' | 'very_high' | null
  growth_potential: 'low' | 'medium' | 'high' | 'very_high' | null
  created_at: string
  updated_at: string
}

export interface InvestorProfile {
  name: string
  type: string
  focus: string[]
  stage: string[]
  investment_range: string
  portfolio_companies: string[]
  why_they_invest: string
}

export interface InvestorMatch {
  id: string
  idea_id: string
  project_id: string
  match_score: number | null
  matching_reasons: string[] | null
  potential_valuation_range: string | null
  funding_stage: string | null
  investor_profiles: InvestorProfile[] | null
  investor_interest_level: 'low' | 'medium' | 'high' | 'very_high' | null
  competitive_advantage: string | null
  market_differentiators: string[] | null
  created_at: string
  updated_at: string
}