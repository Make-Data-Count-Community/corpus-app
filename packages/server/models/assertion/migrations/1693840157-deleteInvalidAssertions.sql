-- delete assertions according to issue https://gitlab.coko.foundation/datacite/datacite/-/issues/40
CREATE TEMP TABLE assertions_to_delete ON COMMIT DROP AS
SELECT assertions.id FROM assertions 
WHERE doi like '%10.15468%'
AND relation_type_id = 'references';

DELETE FROM assertions WHERE assertions.id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_affiliations WHERE assertions_affiliations.assertion_id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_funders WHERE assertions_funders.assertion_id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_subjects WHERE assertions_subjects.assertion_id IN (SELECT id FROM assertions_to_delete);