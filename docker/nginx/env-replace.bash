#!/usr/bin/env bash

set -o nounset
set -o errexit

TEMPLATE_FILE="$1"
TEMPLATE_TEXT=$(cat "${TEMPLATE_FILE}")

PLACEHOLDER_LIST=$(echo "${TEMPLATE_TEXT}" | grep -oP '\${ ?[a-zA-Z0-9_]+ ?}' | sort | uniq)

ENV_VAR_NAME_LIST=$(echo "${PLACEHOLDER_LIST}" | grep -oP '[a-zA-Z0-9_]+' | sort | uniq)

RESULT_TEXT="${TEMPLATE_TEXT}"
for ENV_VAR_NAME in ${ENV_VAR_NAME_LIST}; do
    ENV_VAR_VALUE=$(printenv "${ENV_VAR_NAME}")
    RELATED_PLACEHOLDER_LIST=$(echo "${PLACEHOLDER_LIST}" | grep -P '\${ ?'"${ENV_VAR_NAME}"'+ ?}' | sort | uniq)

    while read -r PLACEHOLDER_NAME; do
        RESULT_TEXT=$(echo "${RESULT_TEXT}" | sed "s|${PLACEHOLDER_NAME}|${ENV_VAR_VALUE}|g")
    done <<< "${RELATED_PLACEHOLDER_LIST}"
done

echo "${RESULT_TEXT}"
