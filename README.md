# Simple share

A simple and customisable knowledge sharing system.
When publishing a link the open graph metadata are automatically scraped from source.
When publishing a post the use can use markdown.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAlessandroAnnini%2Fsimple-share&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_WEBSITE_NAME,NEXT_PUBLIC_TAGS_PIPE_SEPARATED&envDescription=Supabase%20API%20is%20secured%20behind%20an%20API%20gateway%20which%20requires%20an%20API%20Key%20for%20every%20request.&envLink=https%3A%2F%2Fapp.supabase.io%2Fproject%2F%3Cyour-project-ID%3E%2Fsettings%2Fapi)

[DEMO](https://simple-sharing.vercel.app/)

This uses [Supabase](https://supabase.com/) - the open source Firebase alternative

and [Next.js](https://nextjs.org/) - the React framework for production.

![Supabase](./supabase.png 'Supabase')
![Next.js](./next.png 'Next.js')
![Tailwindcss](./tailwindcss.png 'Tailwindcss')

## Getting Started

Make a `.env` file like this:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WEBSITE_NAME=Your site name
NEXT_PUBLIC_TAGS_PIPE_SEPARATED=tag1|tag2|tag3
```

You can get `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Supabase project API keys page at this url: `https://app.supabase.io/project/<your-project-id>/settings/api`

then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase scaffolding query

```sql
-- Scaffolding

--Create a table for "profiles"
create table profiles (
  id uuid references auth.users not null,
  name text unique,
  updated_at timestamp with time zone,

  primary key (id),
  constraint name_length check (char_length(name) >= 3)
);

alter table profiles enable row level security;

--Create profiles table policies

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

--Create a table for "posts"
CREATE TABLE posts (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  title text,
  content text,
  type text,
  author_name text,
  metadata json,
  tag text,
  inserted_at timestamp with time zone,
  updated_at timestamp with time zone
);

alter table posts enable row level security;

--Create posts table policies

create policy "Users can create posts." on posts for
    insert with check (auth.uid() = user_id);

create policy "Users can update their own posts." on posts for
    update using (auth.uid() = user_id);

create policy "Users can delete their own posts." on posts for
    delete using (auth.uid() = user_id);

create policy "Posts are public." on posts for
    select using ( true );
```
