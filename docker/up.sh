#!/usr/bin/env bash

set -o nounset
set -o errexit

function fail() {
    >&2 echo "$1"
    exit 1
}

SCRIPT_PATH=$(readlink -f $0)
SCRIPT_DIR=$(dirname ${SCRIPT_PATH})
PROJECT_DIR=$(dirname ${SCRIPT_DIR})

cd "${PROJECT_DIR}"

# check env vars
UNSET_ENV_VARS=$(docker-compose config 2>&1 | grep -oP '(?<=The ).+(?= variable is not set)' || true)
if [[ "${UNSET_ENV_VARS}" != "" ]] ; then
    fail "Some .env variables are unset: ${UNSET_ENV_VARS}"
fi

SERVICES="$@"

bash -c "docker-compose pull ${SERVICES}"
bash -c "docker-compose build --pull ${SERVICES}"
bash -c "docker-compose up --build --force-recreate --remove-orphans -d ${SERVICES}"
bash -c "docker-compose logs --follow ${SERVICES}"
