-- delete assertions according to issue https://gitlab.coko.foundation/datacite/datacite/-/issues/40
-- we have to remove foreign key constraints to allow truncating

BEGIN;
ALTER TABLE assertions_affiliations DROP CONSTRAINT assertions_affiliations_assertion_id_fkey;
ALTER TABLE assertions_funders DROP CONSTRAINT assertions_funders_assertion_id_fkey;
ALTER TABLE assertions_subjects DROP CONSTRAINT assertions_subjects_assertion_id_fkey;

CREATE TEMP TABLE assertions_without_prefix ON COMMIT DROP AS
SELECT * FROM assertions 
WHERE doi not like '%10.15468%';

CREATE TEMP TABLE assertions_to_keep ON COMMIT DROP AS
SELECT * FROM assertions_without_prefix 
WHERE relation_type_id != 'references';

TRUNCATE TABLE assertions;

INSERT INTO assertions SELECT * FROM assertions_to_keep;

ALTER TABLE assertions_affiliations
    ADD CONSTRAINT assertions_affiliations_assertion_id_fkey FOREIGN KEY (assertion_id) REFERENCES assertions (id) NOT VALID;
ALTER TABLE assertions_funders
    ADD CONSTRAINT assertions_funders_assertion_id_fkey FOREIGN KEY (assertion_id) REFERENCES assertions (id) NOT VALID;
ALTER TABLE assertions_subjects
    ADD CONSTRAINT assertions_subjects_assertion_id_fkey FOREIGN KEY (assertion_id) REFERENCES assertions (id) NOT VALID;

COMMIT;

