#!/bin/bash
echo "Restorind db from dump..."

pg_restore -U postgres -d FungiDB /docker-entrypoint-initdb.d/dump.dump

echo "Restore completed"