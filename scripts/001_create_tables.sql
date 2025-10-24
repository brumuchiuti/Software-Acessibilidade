-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum for member roles
create type member_role as enum (
  'presidente',
  'vice_presidente',
  'diretor',
  'associado_i',
  'associado_ii',
  'associado_iii',
  'associado_senior'
);

-- Create enum for event status
create type event_status as enum (
  'scheduled',
  'ongoing',
  'completed',
  'cancelled'
);

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role member_role not null default 'associado_i',
  director_title text, -- e.g., "Diretor de Marketing", "Diretor de Eventos"
  bio text,
  avatar_url text,
  phone text,
  joined_at timestamp with time zone default now(),
  total_points integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create events table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  status event_status default 'scheduled',
  points_value integer default 10, -- Points awarded for attendance
  max_participants integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create event_attendance table (many-to-many relationship)
create table if not exists public.event_attendance (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  attended boolean default false,
  checked_in_at timestamp with time zone,
  points_earned integer default 0,
  created_at timestamp with time zone default now(),
  unique(event_id, user_id)
);

-- Create activities table (for other engagement activities beyond events)
create table if not exists public.activities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  activity_type text not null, -- e.g., "project", "volunteer", "workshop"
  points_value integer default 5,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create activity_participation table
create table if not exists public.activity_participation (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid references public.activities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  completed boolean default false,
  completed_at timestamp with time zone,
  points_earned integer default 0,
  notes text,
  created_at timestamp with time zone default now(),
  unique(activity_id, user_id)
);

-- Create announcements table
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  priority text default 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_attendance enable row level security;
alter table public.activities enable row level security;
alter table public.activity_participation enable row level security;
alter table public.announcements enable row level security;

-- Profiles policies
create policy "Profiles are viewable by all authenticated users"
  on public.profiles for select
  using (auth.uid() is not null);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Events policies
create policy "Events are viewable by all authenticated users"
  on public.events for select
  using (auth.uid() is not null);

create policy "Only admins can create events"
  on public.events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

create policy "Only admins can update events"
  on public.events for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

create policy "Only admins can delete events"
  on public.events for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Event attendance policies
create policy "Event attendance is viewable by all authenticated users"
  on public.event_attendance for select
  using (auth.uid() is not null);

create policy "Users can register for events"
  on public.event_attendance for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage attendance"
  on public.event_attendance for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Activities policies
create policy "Activities are viewable by all authenticated users"
  on public.activities for select
  using (auth.uid() is not null);

create policy "Only admins can create activities"
  on public.activities for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

create policy "Only admins can update activities"
  on public.activities for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Activity participation policies
create policy "Activity participation is viewable by all authenticated users"
  on public.activity_participation for select
  using (auth.uid() is not null);

create policy "Users can participate in activities"
  on public.activity_participation for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage participation"
  on public.activity_participation for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Announcements policies
create policy "Announcements are viewable by all authenticated users"
  on public.announcements for select
  using (auth.uid() is not null);

create policy "Only admins can create announcements"
  on public.announcements for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

create policy "Only admins can update announcements"
  on public.announcements for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

create policy "Only admins can delete announcements"
  on public.announcements for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('presidente', 'vice_presidente', 'diretor')
    )
  );

-- Create function to update total_points
create or replace function update_user_points()
returns trigger as $$
begin
  update public.profiles
  set total_points = (
    select coalesce(sum(points_earned), 0)
    from (
      select points_earned from public.event_attendance where user_id = new.user_id
      union all
      select points_earned from public.activity_participation where user_id = new.user_id
    ) as all_points
  )
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers to update points
create trigger update_points_on_event_attendance
  after insert or update on public.event_attendance
  for each row
  execute function update_user_points();

create trigger update_points_on_activity_participation
  after insert or update on public.activity_participation
  for each row
  execute function update_user_points();

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Novo Membro')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for better performance
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_total_points on public.profiles(total_points desc);
create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_event_attendance_user on public.event_attendance(user_id);
create index if not exists idx_event_attendance_event on public.event_attendance(event_id);
create index if not exists idx_activity_participation_user on public.activity_participation(user_id);
