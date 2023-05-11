CREATE TABLE IF NOT EXISTS assertions (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  
  -- foreign
  repository_id uuid references repositories,
  publisher_id uuid references publishers,
  journal_id uuid references journals,
  source_type uuid references sources,

  -- own
  title text not null,
  obj_id text not null,
  subj_id text not null,
  published_date timestamp with time zone,
  accession_number text,
  doi text,
  relation_type_id text
);
