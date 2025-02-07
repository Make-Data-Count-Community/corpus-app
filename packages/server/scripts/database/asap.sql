BEGIN;
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

	-- Create new source
	INSERT INTO
		sources (id, type, title, abbreviation)
	VALUES
		(
			uuid_generate_v4(),
			'source',
			'Aligning Science Across Parkinson’s',
			'asap'
		);

	-- Create new repositories

	INSERT INTO repositories (id, type, title)
	VALUES
		(uuid_generate_v4(), 'repository', 'AlphaFold Protein Structure Database'),
		(uuid_generate_v4(), 'repository', 'ENCODE'),
		(uuid_generate_v4(), 'repository', 'GENCODE'),
		(uuid_generate_v4(), 'repository', 'Genome Sequence Archive'),
		(uuid_generate_v4(), 'repository', 'ProteomeXchange'),
		(uuid_generate_v4(), 'repository', 'Sequence Read Archive');
COMMIT;

BEGIN;
	CREATE TEMP TABLE temp_duplicate_repositories AS
	SELECT 
		title,
		MIN(id::text) AS retained_repository_id_text,
		ARRAY_AGG(id) AS duplicate_repository_ids
	FROM repositories
	GROUP BY title
	HAVING COUNT(*) > 1;

	UPDATE assertions
	SET repository_id = temp.retained_repository_id_text::uuid
	FROM temp_duplicate_repositories temp
	WHERE assertions.repository_id = ANY(temp.duplicate_repository_ids)
	AND assertions.repository_id <> temp.retained_repository_id_text::uuid;

	DELETE FROM repositories
	USING temp_duplicate_repositories temp
	WHERE repositories.id = ANY(temp.duplicate_repository_ids)
	AND repositories.id <> temp.retained_repository_id_text::uuid;

	REFRESH MATERIALIZED VIEW last_10_years_assertions;

	ALTER TABLE repositories
	ADD CONSTRAINT unique_repository_title UNIQUE (title);
COMMIT;