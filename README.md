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

git clone https://github.com/your-org/your-repo.git
cd your-repo

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
