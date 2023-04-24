CREATE TABLE IF NOT EXISTS funders (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- own
  first_name text,
  last_name text,
  doi_count bigint,
  accession_number_count bigint
);
