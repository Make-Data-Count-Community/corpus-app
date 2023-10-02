CREATE MATERIALIZED VIEW public.last_10_years_assertions
TABLESPACE pg_default
AS SELECT assertions.id,
    assertions.type,
    assertions.created,
    assertions.updated,
    assertions.activity_id,
    assertions.repository_id,
    assertions.publisher_id,
    assertions.journal_id,
    assertions.source_type,
    assertions.title,
    assertions.obj_id,
    assertions.subj_id,
    assertions.published_date,
    assertions.accession_number,
    assertions.doi,
    assertions.relation_type_id,
    to_char(assertions.published_date, 'YYYY'::text)::integer AS year
   FROM assertions
  WHERE to_char(assertions.published_date, 'YYYY'::text)::integer >= 2013 AND to_char(assertions.published_date, 'YYYY'::text)::integer <= 2023
WITH DATA;

-- View indexes:
CREATE INDEX last_10_years_assertions_year_idx ON public.last_10_years_assertions USING btree (year);
