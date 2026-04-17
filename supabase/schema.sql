-- SOE MVP schema for Supabase.
-- Run in the Supabase SQL editor for the linked project.
-- The app also includes localStorage fallbacks for new MVP tables while this SQL is pending.

create table if not exists entrepreneur_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  full_name text,
  city text,
  phone text,
  stage text default 'Idea' check (stage in ('Idea', 'Validacion', 'Traccion', 'Crecimiento', 'Escalamiento')),
  sector text,
  level text default 'Explorador',
  points integer default 0,
  progress integer default 0,
  completed_tasks integer default 0,
  completed_courses integer default 0,
  applied_programs integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  answers jsonb not null,
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists diagnostic_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  answers jsonb not null,
  scores jsonb not null,
  snapshot jsonb not null,
  recommended_tasks jsonb not null,
  model text,
  created_at timestamptz default now()
);

create table if not exists route_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  section text not null,
  title text not null,
  status text default 'pendiente' check (status in ('pendiente', 'en progreso', 'completado', 'bloqueado')),
  priority text default 'Media' check (priority in ('Alta', 'Media', 'Baja')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table route_tasks add column if not exists due_date date;
alter table route_tasks add column if not exists rationale text;
alter table route_tasks add column if not exists expected_outcome text;
alter table route_tasks add column if not exists acceptance_criteria text;
alter table route_tasks add column if not exists source text default 'manual';
alter table route_tasks add column if not exists source_diagnostic_id uuid;
alter table route_tasks add column if not exists order_index integer default 0;
alter table route_tasks add column if not exists archived boolean default false;

create table if not exists saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  opportunity_id text not null,
  saved_at timestamptz default now(),
  unique (user_id, opportunity_id)
);

create table if not exists saved_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider_id text not null,
  saved_at timestamptz default now(),
  unique (user_id, provider_id)
);

create table if not exists course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id text not null,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  updated_at timestamptz default now(),
  unique (user_id, course_id)
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null,
  file_type text,
  size_bytes bigint,
  status text default 'Borrador' check (status in ('Borrador', 'Listo')),
  storage_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  description text not null,
  icon text,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  message text,
  type text default 'general',
  dedupe_key text,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists agent_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  actions jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text not null,
  description text,
  category text,
  stage text,
  city text,
  website text,
  instagram text,
  linkedin text,
  contact_email text,
  problem_solved text,
  services text,
  looking_for text[],
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table entrepreneur_profiles enable row level security;
alter table diagnostic_answers enable row level security;
alter table diagnostic_runs enable row level security;
alter table route_tasks enable row level security;
alter table saved_opportunities enable row level security;
alter table saved_providers enable row level security;
alter table course_progress enable row level security;
alter table documents enable row level security;
alter table activity_events enable row level security;
alter table notifications enable row level security;
alter table agent_messages enable row level security;
alter table business_profiles enable row level security;

drop policy if exists "Users own their profile" on entrepreneur_profiles;
create policy "Users own their profile" on entrepreneur_profiles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their diagnostic" on diagnostic_answers;
create policy "Users own their diagnostic" on diagnostic_answers
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their diagnostic runs" on diagnostic_runs;
create policy "Users own their diagnostic runs" on diagnostic_runs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their tasks" on route_tasks;
create policy "Users own their tasks" on route_tasks
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their saved opportunities" on saved_opportunities;
create policy "Users own their saved opportunities" on saved_opportunities
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their saved providers" on saved_providers;
create policy "Users own their saved providers" on saved_providers
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their course progress" on course_progress;
create policy "Users own their course progress" on course_progress
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their documents" on documents;
create policy "Users own their documents" on documents
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their activity events" on activity_events;
create policy "Users own their activity events" on activity_events
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their notifications" on notifications;
create policy "Users own their notifications" on notifications
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users own their agent messages" on agent_messages;
create policy "Users own their agent messages" on agent_messages
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Public business profiles are visible to all" on business_profiles;
create policy "Public business profiles are visible to all" on business_profiles
  for select using (is_public = true or auth.uid() = user_id);

drop policy if exists "Users own their business profile" on business_profiles;
create policy "Users own their business profile" on business_profiles
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into entrepreneur_profiles (user_id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
