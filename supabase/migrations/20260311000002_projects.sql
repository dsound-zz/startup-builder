-- Create projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.projects enable row level security;

-- Create indexes
create index projects_user_id_idx on public.projects(user_id);
create index projects_created_at_idx on public.projects(created_at desc);