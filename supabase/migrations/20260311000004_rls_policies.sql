-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Ideas policies
create policy "Users can view ideas in their projects"
  on public.ideas for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = ideas.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create ideas in their projects"
  on public.ideas for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = ideas.project_id
      and projects.user_id =  auth.uid()
    )
  );

create policy "Users can update ideas in their projects"
  on public.ideas for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = ideas.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update ideas in their projects"
  on public.ideas for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = ideas.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can delete ideas in their projects"
  on public.ideas for delete
  using (
    exists (
      select 1 from public.projects
      where projects.id = ideas.project_id
      and projects.user_id = auth.uid()
    )
  );