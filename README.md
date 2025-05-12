# Mood Tracker

Mood Tracker is a web application that helps users log, track, and analyze their moods over time. It provides insights into emotional patterns and trends to promote self-awareness and mental well-being.

## Features

- Log moods with emojis and optional notes.
- View mood statistics, including:
  - Most common moods.
  - Mood streaks.
  - Mood distribution and trends.
- Dynamic language switching (localization).
- Responsive design for all devices.
- Secure user authentication.

## Tech Stack

- **Frontend**: Vue 3, Tailwind CSS, TanStack Query
- **Backend**: Hono, Drizzle ORM, PostgreSQL, Kinde
- **Runtime**: Bun.js
- **Database**: Neon Postgres (cloud-hosted PostgreSQL)

## Installation

### Prerequisites

- [Bun](https://bun.sh)
- [Neon Postgres](https://neon.tech)
- [Kinde](https://kinde.com)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/mood_tracker.git
   cd mood_tracker
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables:

   ```
   Create a .env file in the root directory with the following:
    DATABASE_URL='postgresql://...'
    KINDE_ISSUER_URL='...'
    KINDE_CLIENT_ID='...'
    KINDE_CLIENT_SECRET='...'
    KINDE_SITE_URL='...'
    KINDE_LOGOUT_REDIRECT_URI='...'
    KINDE_DOMAIN='...'
    KINDE_REDIRECT_URI='...'
   ```

4. Start the backend server:

   ```bash
   bun dev
   ```

5. Start the frontend server:
   ```bash
   cd frontend
   bun dev
   ```

## Usage

- Frontend: Accessible at http://localhost:5173/ after running bun dev inside the frontend folder.
- Backend: API endpoints are available at http://localhost:3000/api after running bun dev inside the project root.

## Folder Structure

```
    mood_tracker/
├── backend/                                 # Backend API and database logic
├── frontend/                                # Vue.js frontend
├── .env                                     # Environment variables
├── Dockerfile                               # Docker configuration
└── [README.md](http://_vscodecontentref_/1) # Project documentation
```

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Notes on Neon Postgres

- Neon Postgres is a cloud-hosted PostgreSQL database service. It provides a connection string that you can use in the DATABASE_URL environment variable.
- Ensure that your Neon database is properly configured and accessible from your backend server.
- For more information, visit the [Neon documentation](https://neon.tech/docs/introduction).
