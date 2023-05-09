CREATE TABLE IF NOT EXISTS assertions_funders (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- foreign
  assertion_id uuid references assertions,
  funder_id uuid references funders
);
