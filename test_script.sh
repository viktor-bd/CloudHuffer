#!/usr/bin/env bash
set -euo pipefail

echo "=== test_script.sh: Start ==="

echo "-- Backend: restore, build, test --"
dotnet restore
dotnet build --no-restore --configuration Release
dotnet test CloudHufferApi/CloudHufferApi.Tests/CloudHufferApi.Tests.csproj --no-build --verbosity normal

echo "-- Frontend: install and build --"
pushd CloudHufferWeb
npm ci
npm run build -- --configuration development
popd

echo "=== test_script.sh: All steps completed successfully ==="
