CREATE TABLE IF NOT EXISTS activity_log (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,
  
  -- foreign
  user_id uuid references users,

  -- own
  object_id uuid,
  table_name text,
  action text,
  description text,
  proccessed boolean default false,
  data text
);
