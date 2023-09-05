CREATE TABLE IF NOT EXISTS datacite_prefix (
  -- base
  id uuid primary key,
  type text not null,
  prefix text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone
);