CREATE TABLE IF NOT EXISTS assertions_affiliations (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  --foreign
  assertion_id uuid references assertions INITIALLY DEFERRED,
  affiliation_id uuid references affiliations
);
