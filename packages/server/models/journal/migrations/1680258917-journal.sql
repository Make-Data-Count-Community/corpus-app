CREATE TABLE IF NOT EXISTS journals (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- own
  title text,
  external_id text,
  doi_count bigint,
  accession_number_count bigint
);
