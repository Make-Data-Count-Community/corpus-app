CREATE TABLE IF NOT EXISTS publishers (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  
    -- own
  title text,
  doi_count bigint,
  accession_number_count bigint
);
