-- public.last_10_years_assertions source

CREATE MATERIALIZED VIEW IF NOT EXISTS public.last_10_years_assertions
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
    assertions.source_id,
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
CREATE INDEX IF NOT EXISTS last_10_years_assertions_doi__accession_year_repository_publish ON public.last_10_years_assertions USING btree (doi, accession_number, year, repository_id, publisher_id);
CREATE INDEX IF NOT EXISTS last_10_years_assertions_doi_accesion_year_repository_publisher ON public.last_10_years_assertions USING btree (year, doi, accession_number, repository_id, publisher_id, journal_id);
CREATE INDEX IF NOT EXISTS last_10_years_assertions_doi_accession_year_idx ON public.last_10_years_assertions USING btree (doi, accession_number, year);
CREATE INDEX IF NOT EXISTS last_10_years_assertions_doi_accession_year_repository_idx ON public.last_10_years_assertions USING btree (doi, accession_number, year, repository_id);
CREATE INDEX IF NOT EXISTS last_10_years_assertions_doi_accession_year_repository_journali ON public.last_10_years_assertions USING btree (doi, accession_number, year, repository_id, journal_id);
