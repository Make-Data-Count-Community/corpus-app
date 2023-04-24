CREATE TABLE IF NOT EXISTS citations_affiliations (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  --foreign
  citation_id uuid references citations,
  affiliation_id uuid references affiliations
);
