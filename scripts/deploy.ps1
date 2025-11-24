Param(
    [switch]$BuildOnly
)

Write-Host "Building containers..." -ForegroundColor Cyan
docker compose build

if (-not $BuildOnly) {
    Write-Host "Seeding database..." -ForegroundColor Cyan
    docker compose run --rm api npm run seed

    Write-Host "Starting stack..." -ForegroundColor Cyan
    docker compose up -d

    Write-Host "Services are up. API -> http://localhost:4000, Client -> http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "Build completed. Skipping seed + up steps." -ForegroundColor Yellow
}

