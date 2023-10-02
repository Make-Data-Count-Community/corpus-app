-- public.facet_unique_counts source

CREATE MATERIALIZED VIEW IF NOT EXISTS public.facet_unique_counts
TABLESPACE pg_default
AS WITH agg AS (
         SELECT DISTINCT assertions.journal_id,
            assertions.source_id
           FROM assertions
          GROUP BY assertions.source_id, assertions.journal_id
        ), agg1 AS (
         SELECT DISTINCT assertions.repository_id,
            assertions.source_id
           FROM assertions
          GROUP BY assertions.source_id, assertions.repository_id
        ), agg2 AS (
         SELECT DISTINCT aa.affiliation_id,
            a.source_id
           FROM assertions a
             JOIN assertions_affiliations aa ON a.id = aa.assertion_id
          GROUP BY a.source_id, aa.affiliation_id
        ), agg3 AS (
         SELECT DISTINCT aa.funder_id,
            a.source_id
           FROM assertions a
             JOIN assertions_funders aa ON a.id = aa.assertion_id
          GROUP BY a.source_id, aa.funder_id
        ), agg4 AS (
         SELECT DISTINCT aa.subject_id,
            a.source_id
           FROM assertions a
             JOIN assertions_subjects aa ON a.id = aa.assertion_id
          GROUP BY a.source_id, aa.subject_id
        )
 SELECT count(*) AS count,
    agg1.source_id,
    'repositories'::text AS facet
   FROM agg1
  GROUP BY agg1.source_id
UNION
 SELECT count(*) AS count,
    agg.source_id,
    'journals'::text AS facet
   FROM agg
  GROUP BY agg.source_id
UNION
 SELECT count(*) AS count,
    agg2.source_id,
    'affiliations'::text AS facet
   FROM agg2
  GROUP BY agg2.source_id
UNION
 SELECT count(*) AS count,
    agg3.source_id,
    'funders'::text AS facet
   FROM agg3
  GROUP BY agg3.source_id
UNION
 SELECT count(*) AS count,
    agg4.source_id,
    'subjects'::text AS facet
   FROM agg4
  GROUP BY agg4.source_id
WITH DATA;