-- delete existing CZI data, to be replaced with new dataset

CREATE TEMP TABLE assertions_to_delete ON COMMIT DROP AS
SELECT assertions.id FROM assertions 
INNER JOIN sources ON assertions.source_id = sources.id
WHERE sources.abbreviation = 'czi';

DELETE FROM assertions WHERE assertions.id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_affiliations WHERE assertions_affiliations.assertion_id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_funders WHERE assertions_funders.assertion_id IN (SELECT id FROM assertions_to_delete);
DELETE FROM assertions_subjects WHERE assertions_subjects.assertion_id IN (SELECT id FROM assertions_to_delete);