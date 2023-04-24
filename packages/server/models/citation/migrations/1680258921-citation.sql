CREATE TABLE IF NOT EXISTS citations (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  
  -- foreign
  subject_id uuid references subjects,
  repository_id uuid references repositories,
  publisher_id uuid references publishers,
  journal_id uuid references journals,
  source_type uuid references sources,

  -- own
  published_date timestamp with time zone
);
