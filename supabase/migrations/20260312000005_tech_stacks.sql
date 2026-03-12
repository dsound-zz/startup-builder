-- Create tech_stacks table
create table public.tech_stacks (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade not null,
    idea_id uuid references public.ideas(id) on delete cascade,
    
    -- Recommended technologies
    frontend_framework jsonb,
    backend_framework jsonb,
    database jsonb,
    infrastructure jsonb,
    tools jsonb,
    
    -- Scoring & metadata
    confidence_score integer check (confidence_score >= 0 and confidence_score <= 100),
    complexity_level text check (complexity_level in ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_cost text,
    timeline_estimate text,
    
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.tech_stacks enable row level security;

-- Create indexes
create index tech_stacks_project_id_idx on public.tech_stacks(project_id);
create index tech_stacks_idea_id_idx on public.tech_stacks(idea_id);
create index tech_stacks_created_at_idx on public.tech_stacks(created_at desc);

-- RLS Policies
create policy "Users can view tech stacks for their projects"
    on public.tech_stacks for select
    using (
        exists (
            select 1 from public.projects
            where projects.id = tech_stacks.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can create tech stacks for their projects"
    on public.tech_stacks for insert
    with check (
        exists (
            select 1 from public.projects
            where projects.id = tech_stacks.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can update tech stacks for their projects"
    on public.tech_stacks for update
    using (
        exists (
            select 1 from public.projects
            where projects.id = tech_stacks.project_id
            and projects.user_id = auth.uid()
        )
    );

create policy "Users can delete tech stacks for their projects"
    on public.tech_stacks for delete
    using (
        exists (
            select 1 from public.projects
            where projects.id = tech_stacks.project_id
            and projects.user_id = auth.uid()
        )
    );