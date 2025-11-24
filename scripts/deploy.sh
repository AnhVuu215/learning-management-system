#!/usr/bin/env bash
set -euo pipefail

echo "Building containers..."
docker compose build

echo "Applying database migrations/seed..."
docker compose run --rm api npm run seed

echo "Starting stack..."
docker compose up -d

echo "Services are up. API -> http://localhost:4000, Client -> http://localhost:5173"

