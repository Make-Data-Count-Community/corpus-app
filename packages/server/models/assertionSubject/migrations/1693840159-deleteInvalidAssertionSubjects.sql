-- -- remove records that no longer have a matching assertion record

CREATE TEMP TABLE assertions_subjects_to_keep ON COMMIT DROP AS
SELECT * FROM assertions_subjects
WHERE assertions_subjects.assertion_id IN (SELECT id FROM assertions);

TRUNCATE TABLE assertions_subjects;

INSERT INTO assertions_subjects SELECT * FROM assertions_subjects_to_keep;