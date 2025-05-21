#!/bin/sh
if [ ! -f ./data/spinwheel.db ]; then
  echo "[entrypoint] Database not found, running db:setup..."
  pnpm run db:setup
else
  echo "[entrypoint] Database found, skipping db:setup."
fi
exec pnpm start
