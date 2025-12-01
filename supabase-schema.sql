-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  email text,
  avatar_url text,
  last_seen timestamp with time zone default now(),
  is_anonymous boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Users policies
create policy "Users are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can insert own data"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id);

-- Conversations table
create table if not exists public.conversations (
  id text primary key,
  participants text[] not null,
  last_message text,
  last_message_time timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.conversations enable row level security;

-- Conversations policies
create policy "Users can view conversations they are part of"
  on public.conversations for select
  using (auth.uid()::text = any(participants));

create policy "Users can create conversations"
  on public.conversations for insert
  with check (auth.uid()::text = any(participants));

create policy "Users can update conversations they are part of"
  on public.conversations for update
  using (auth.uid()::text = any(participants));

-- Messages table
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id text not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  text text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Messages policies
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and auth.uid()::text = any(conversations.participants)
    )
  );

create policy "Users can insert messages in their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = conversation_id
      and auth.uid()::text = any(conversations.participants)
    )
  );

-- Typing indicators table
create table if not exists public.typing_indicators (
  conversation_id text not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  updated_at timestamp with time zone default now(),
  primary key (conversation_id, user_id)
);

-- Enable RLS
alter table public.typing_indicators enable row level security;

-- Typing indicators policies
create policy "Users can view typing indicators in their conversations"
  on public.typing_indicators for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = typing_indicators.conversation_id
      and auth.uid()::text = any(conversations.participants)
    )
  );

create policy "Users can insert typing indicators"
  on public.typing_indicators for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.conversations
      where conversations.id = conversation_id
      and auth.uid()::text = any(conversations.participants)
    )
  );

create policy "Users can update own typing indicators"
  on public.typing_indicators for update
  using (auth.uid() = user_id);

create policy "Users can delete own typing indicators"
  on public.typing_indicators for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_created_at_idx on public.messages(created_at);
create index if not exists conversations_updated_at_idx on public.conversations(updated_at);
create index if not exists users_last_seen_idx on public.users(last_seen);

-- Create storage bucket for chat images
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Anyone can view chat images"
  on storage.objects for select
  using (bucket_id = 'chat-images');

create policy "Authenticated users can upload chat images"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-images'
    and auth.role() = 'authenticated'
  );

create policy "Users can update own images"
  on storage.objects for update
  using (
    bucket_id = 'chat-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'chat-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
