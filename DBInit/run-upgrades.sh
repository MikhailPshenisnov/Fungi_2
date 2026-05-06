#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

print_help() {
  cat <<'EOF'
Usage:
  bash DBInit/run-upgrades.sh [options]

Options:
  --with-csv-replace   Additionally run DBInit/6-replace-mushrooms-csv.sql
  --container NAME     Docker container name (default: fungi-db)
  --help               Show this help

Environment (loaded from .env automatically if exists):
  DB_USER (default: fungi)
  DB_NAME (default: FungiDB)
  DB_PORT (default: 5531)
  DB_CONTAINER (fallback for --container)
EOF
}

WITH_CSV_REPLACE="false"
DB_CONTAINER="${DB_CONTAINER:-fungi-db}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-csv-replace)
      WITH_CSV_REPLACE="true"
      shift
      ;;
    --container)
      if [[ $# -lt 2 ]]; then
        echo "Error: --container requires value" >&2
        exit 1
      fi
      DB_CONTAINER="$2"
      shift 2
      ;;
    --help|-h)
      print_help
      exit 0
      ;;
    *)
      echo "Error: unknown option '$1'" >&2
      print_help
      exit 1
      ;;
  esac
done

if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${ROOT_DIR}/.env"
  set +a
fi

DB_USER="${DB_USER:-fungi}"
DB_NAME="${DB_NAME:-FungiDB}"
DB_PORT="${DB_PORT:-5531}"

UPGRADE_FILES=(
  "2-upgrade-avatar.sql"
  "3-upgrade-rbac.sql"
  "4-upgrade-articles-workflow.sql"
  "5-upgrade-mushrooms-workflow.sql"
  "6-upgrade-mushroom-field-lengths.sql"
  "7-upgrade-user-consents.sql"
  "8-replace-demo-articles.sql"
)

if [[ "${WITH_CSV_REPLACE}" == "true" ]]; then
  UPGRADE_FILES+=("6-replace-mushrooms-csv.sql")
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker not found in PATH" >&2
  exit 1
fi

if ! docker ps --format '{{.Names}}' | grep -qx "${DB_CONTAINER}"; then
  echo "Error: container '${DB_CONTAINER}' is not running." >&2
  echo "Hint: docker compose up -d fungi-db" >&2
  exit 1
fi

echo "Applying DB upgrades to container '${DB_CONTAINER}'"
echo "DB: ${DB_NAME}, user: ${DB_USER}, port: ${DB_PORT}"

for file_name in "${UPGRADE_FILES[@]}"; do
  file_path="${SCRIPT_DIR}/${file_name}"

  if [[ ! -f "${file_path}" ]]; then
    echo "Error: file not found: ${file_path}" >&2
    exit 1
  fi

  echo "==> ${file_name}"
  cat "${file_path}" | docker exec -i "${DB_CONTAINER}" psql \
    -v ON_ERROR_STOP=1 \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    -p "${DB_PORT}"
done

echo "Done."
