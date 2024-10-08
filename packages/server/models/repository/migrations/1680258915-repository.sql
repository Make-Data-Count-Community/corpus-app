CREATE TABLE IF NOT EXISTS repositories (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  
    -- own
  external_id text,
  title text,
  doi_count bigint,
  accession_number_count bigint
);
