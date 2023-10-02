-- -- remove records that no longer have a matching assertion record

CREATE TEMP TABLE assertions_affiliations_to_keep ON COMMIT DROP AS
SELECT * FROM assertions_affiliations
WHERE assertions_affiliations.assertion_id IN (SELECT id FROM assertions);

TRUNCATE TABLE assertions_affiliations;

INSERT INTO assertions_affiliations SELECT * FROM assertions_affiliations_to_keep;