-- -- remove records that no longer have a matching assertion record

CREATE TEMP TABLE assertions_funders_to_keep ON COMMIT DROP AS
SELECT * FROM assertions_funders
WHERE assertions_funders.assertion_id IN (SELECT id FROM assertions);

TRUNCATE TABLE assertions_funders;

INSERT INTO assertions_funders SELECT * FROM assertions_funders_to_keep;