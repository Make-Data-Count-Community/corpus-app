#!/bin/sh
set -x
# This is run through docker. Its CWD will be the root folder.
node_modules/.bin/pubsweet migrate
node ./scripts/seedGlobalTeams.js
node ./scripts/ensureTempFolderExists.js

exec "$@"
