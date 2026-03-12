-- Create ideas table
create table public.ideas (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  
  -- Core fields
  title text not null,
  problem text not null,
  solution text not null,
  target_audience text not null,
  unique_value_proposition text not null,
  
  -- Market analysis
  market_size text,
  competitors jsonb default '[]'::jsonb,
  competitive_advantage text,
  
  -- Business model
  revenue_streams jsonb default '[]'::jsonb,
  pricing_strategy text,
  key_metrics jsonb default '[]'::jsonb,
  
  -- Execution
  mvp_features jsonb default '[]'::jsonb,
  technical_requirements text,
  team_requirements text,
  timeline text,
  budget_estimate text,
  
  -- Risk & validation
  risks jsonb default '[]'::jsonb,
  validation_steps jsonb default '[]'::jsonb,
  
  -- Metadata
  status text default 'draft' check (status in ('draft', 'in_progress', 'validated', 'rejected')),
  score integer check (score >= 0 and score <= 100),
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.ideas enable row level security;

-- Create indexes
create index ideas_project_id_idx on public.ideas(project_id);
create index ideas_status_idx on public.ideas(status);
create index ideas_created_at_idx on public.ideas(created_at desc);