# CloudHuffer Solution
NOTE: This is WIP - as of 2/9/2025 not yet at a release ready for use. Star the project for updates on releases.
This solution contains three projects:

- **CloudHufferApi**: ASP.NET Core Web API backend
- **CloudHufferApi.Tests**: xUnit backend tests
- **CloudHufferWeb**: Angular frontend (scaffolded with Angular CLI)

## Structure

- Backend code: `CloudHufferApi/`
- Backend tests: `CloudHufferApi.Tests/`
- Frontend code: `CloudHufferWeb/`

## Getting Started

1. Build and run the backend:
   ```sh
   dotnet build CloudHufferApi/CloudHufferApi.csproj
   dotnet run --project CloudHufferApi/CloudHufferApi.csproj
   ```
2. Build and run the frontend:
   ```sh
   cd CloudHufferWeb
   npm install
   npm start
   ```

## Next Steps
- Implement features in the appropriate folders (Controllers, Services, etc.)
- Add tests in `CloudHufferApi.Tests`
- Use the Angular app for the user interface

---

For more details, see the documentation and project board.
# CloudHuffer
A web application to parse Eve Online gas-huffing probe data and calculate optimal ISK/hour yields.
Features

Paste-and-go probe scanner text parsing

Manual cloud selection from bookmarks

Real‑time gas composition, volume, and ISK/m³ data

Time‑to‑clear estimates based on customizable m³/min huff rates

Multi‑character profiles with module, implant, and link bonuses

Cached 3rd‑party ISK price API with scheduled refresh

Tech Stack

Backend: C# (.NET Core / ASP.NET Core) in Docker

Frontend: Angular SPA

Database: SQL Server (Docker) + Redis cache

Integrations: Third‑party ISK price API, future CCP ESI OAuth

Installation

Clone the repo:

git clone https://github.com/viktor-bd/CloudHuffer.git
cd CloudHuffer

Adjust configuration in appsettings.json or environment variables.

Build and run with Docker Compose:

docker-compose up --build

Open http://localhost:4200 in your browser.

Usage

Paste your Eve probe scanner window text into the input field.

Review detected clouds or manually select from bookmarks.

Configure your huff rate and bonuses in Profile Settings.

View the dashboard for ISK/m³ values, volumes, and clear times.

Contributing

Fork the repository.

Create a feature branch: git checkout -b feature-name

Commit changes: `git commit -m "Add feature"

Push and open a PR.

License

This project is licensed under the GNU General Public License V3. See LICENSE for details.

CI notes:
- The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that currently runs the following (Option 1):
  - Restores and builds the .NET backend and runs existing .NET tests
  - Builds the Angular frontend using `npm ci` and `npm run build`
- Future improvement (Option 2): add Angular unit tests (Karma/Jasmine) and run them in CI using a headless browser; this will provide richer frontend test coverage.
