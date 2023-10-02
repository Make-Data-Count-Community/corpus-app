-- public.count_growth_per_day source

CREATE MATERIALIZED VIEW IF NOT EXISTS public.count_growth_per_day
TABLESPACE pg_default
AS SELECT date_trunc('day'::text, assertions.created) AS created,
    count(assertions.doi) AS count_doi,
    count(assertions.accession_number) AS count_accession_number
   FROM assertions
  GROUP BY (date_trunc('day'::text, assertions.created))
WITH DATA;