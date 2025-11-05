-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  user_id uuid references auth.users on delete cascade primary key,
  plan text not null check (plan in ('PRO', 'ALL_ACCESS')),
  stripe_customer_id text,
  status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Subscriptions policies
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

