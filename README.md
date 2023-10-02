## Name

Datacite Citation Corpus Dashboard

## Description

The dashboard visualizes assertion data sources from the datacite and crossref APIs, as well as CZI data dumps stored in S3.

## Architecture

### EC2

The client and server run within a docker container on an EC2 instance `DataciteReadSeedSource-1`.
An elastic IP is assosciated with the instance to provide a static IP address, mapped to `http://corpus.stage.datacite.org/` DNS

### RDS

Data is stored in a postgres RDS database - `datacite`

### S3

S3 is used as a ingest source for CZI data. CZI JSON files must be stored in the `seed-source-files` bucket. The path to the folder read to ingest the CZI data is specified in the `S3_CZI_FOLDER_PATH` environment variable in the `.env` file.

Data dumps trigged through the `api/data-dump/last-month|all` API will trigger zipped data dump upload to S3 in the `exported-data-files` bucket. Data dumps take around 10 minutes to be created, so be patient!

## Development

Docker containers are used for development and production builds, as well as data import scripts. You must have the docker engine running.
To run a local instance of the client and server, use the following command to build the local containers

```
docker-compose -f docker-compose.development.yml build
docker-compose -f docker-compose.development.yml up
```

The app should be available at `http://localhost/dashboard`

## Production Deployment

For the production build, the client files are bundled into a static `_build` directory from which the client app is served, through the port specified in the `.env` variable `CLIENT_PORT`.

In order to create a production build, you need to connect to the `DataciteReadSeedSource-1` as `ec2-user`, then cd into the `/datacite` directory. From there you can build the production docker image and run it using:

```
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up
```

The app should now be available throught that ec2 instances DNS, or ideally through `http://corpus.stage.datacite.org/`

## Data Ingestion

### CZI

The process of ingesting CZI data has two steps.
First, from an ec2 instance or locally, specify the S3 path to the JSON files in S3 through the `S3_CZI_FOLDER_PATH`. Because the CZI dataset was so large, it was necessary to run imports in parallel on multiple instances. This is why the current folder scheme is named `czi/dataset_metions_batch_<x>/`. The JSON files are split into multiple subfolders, so that multiple instances could each be assigned a folder to read from.
To run a CZI import process, use `docker-compose.cziimport.yml` by running

```
docker-compose -f docker-compose.cziimport.yml build
docker-compose -f docker-compose.cziimport.yml up
```

The first stage of the import streams all the files found in the specified S3 folder and for each record there is some filtering logic applied, and then the data is stored in chunks of 500 records into the `activity_log` table in posgres.

Once all the file data has been read, the data in the unprocessed activity_log records is assigned to 20 parallel threads. Each thread takes the records and for each record fetches additional metadata from the datacite and crossref APIs in order to build an assertion record, and then those are batch saved to the `assertions` table in the DB.

Because each CZI record requires multiple API calls, the import process for the entire dataset (approx 15 million records) takes very long. This process can be sped up by running the import from multiple EC2 instances, each assigned their own S3 subfolder through the `S3_CZI_FOLDER_PATH`.

- NOTE \* the import code is not idempotent, so if you run it twice for the same folder, the same records will be duplicated in the database.
- NOTE \* the CZI JSON files provided were not sytactically correct JSON arrays, which broke the file streaming originallly. So make sure the JSON files are properly formatted.

### Datacite API

The ingestion process for datacite API data is similar - data will be pulled from the API and dumped into `activity_log`, and then subseqeuntly proccessed into assertion records.
The datacite import can be run using

```
docker-compose -f docker-compose.dataciteimport.yml build
docker-compose -f docker-compose.dataciteimport.yml up
```

The `START_YEAR` environment variable can be set to specify date filtering on the API.

## Environment Variables

Each instance running either the client/server or the importer containers requires some environment vars to be configured in the top level `.env` file, which is excluded from git.
An example file looks like this:

```
START_YEAR=2023
END_YEAR=2023
POSTGRES_DB=datacite
POSTGRES_USER=postgres
POSTGRES_PASSWORD='2RRk3BAbv0Y+#q$c'
POSTGRES_HOST=datacite.cpcwgoa3uzw1.eu-west-1.rds.amazonaws.com
CLIENT_PORT=80
S3_CZI_FOLDER_PATH='czi/dataset_metions_batch_2/'
```

This is how you can configure connections to different databases, if you need to rollback, or specifiy different folders from which to import CZI data.

## Useful DB scripts

Some migrations were required to remove unneeded or incorrect data during development. They can be viewed in the `migrations` folder for each model. Migrations are run automatically when a container starts, and are ordered by the timestamp used in their name.

Some noteworthy ones include:

### Removing all CZI data

In the case of new, more accurate CZI datasets being generated, it may be necessary to delete all CZI assertions from the database - which can be millions of records.
The `packages/server/models/assertion/migrations/1693590910-deleteCZIData.sql` query could do this, but will take days to run due to the size of the database.
The faster approach is to save the records to keep in a temp table, and then truncate the assertions table and re-insert the remaining records from the temple table. This requires first removing the foreign key constraints, and then re-creating them after.
You can see an exampe of this done in the set of migrations:

- packages/server/models/assertion/migrations/1693840157-deleteInvalidAssertions.sql
- packages/server/models/assertionAffiliation/migrations/1694002643-deleteInvalidAssertionAffiliations.sql
- packages/server/models/assertionFunder/migrations/1693840158-deleteInvalidAssertionFunders.sql
- packages/server/models/assertionSubject/migrations/1693840159-deleteInvalidAssertionSubjects.sql
- packages/server/models/assertion/migrations/1695146647-fixDeferredConstraints.sql _NOTE_ this is required after you break the foreign key constraints, otherwise future assertion imports will fail with foreign key validation errors

### Refreshing aggregate data

The assertion data is summarized in a set of materialized views that need to be updated when data is added or removed. That can be done by running

```
REFRESH MATERIALIZED VIEW last_10_years_assertions;
REFRESH MATERIALIZED VIEW count_growth_per_day;
REFRESH MATERIALIZED VIEW facet_unique_counts;
```

The import code is already configured to run this at the end of processing all activity logs. Additonally, the `updateSourceDoiCount` function code needs to be run to update the aggregate counts for assertions in the `sources` table.

## Client

The client is built using React, with Apollo used to fetch data through graphQL queries.
The data visualizations are created using React Vega (https://www.npmjs.com/package/react-vega) which creates react components based off of vega specifications - see more here https://vega.github.io/vega/

## Further work

There are a couple optimizations that could be done to improve the data import process and overall functionality.
There are issues in gitlab for those here - https://gitlab.coko.foundation/datacite/datacite/-/issues

## Troubleshooting

### Invalid host header error when loading dashboard

This might happen if you rebuild the development docker container and launch the site and try to load it at port 80, as specified in the `CLIENT_PORT` env var. This is because the coko dev server by default serves the client at port 3000. You can hack it to allow port 80 in development by doing the following:

- ssh into the running client docker container using

```
docker exec -it <docker container id> bash
```

- Then navigate to `/home/node/app/node_modules/@coko/client/webpack/webpack.config.js`
- Edit that file and add the following to the `devServer` section:

```
devServer: {
    //whatever else is here
    allowedHosts: 'all',
  },
```

This should allow traffic through port 80 until the container is rebuilt.

## Authors and acknowledgment

Ping Grant van Helsdingen at gvanhels@gmail.com for any other questions.
