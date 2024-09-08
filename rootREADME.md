# Habit Tracker

Habit Tracker is a full-stack web application designed to help users create, track, and visualize their habits. It features a React frontend, Express backend, and PostgreSQL database.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete habits
- Track daily habit completion
- Visualize habit progress with charts

## Tech Stack

- Frontend: React, Bootstrap, React Router, Axios
- Backend: Node.js, Express, JWT for authentication
- Database: PostgreSQL
- Charting: Google Visualization API

## Prerequisites

- Node.js (v14+ recommended)
- npm
- PostgreSQL

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `server` directory with the following:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   This will run both the backend server and the React development server.

## Directory Structure

- `/client`: React frontend
- `/server`: Express backend

## Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run server`: Start only the backend server
- `npm run client`: Start only the frontend development server
- `npm run build`: Build the frontend for production

## Deployment

This app is configured for easy deployment to Render. See [Render's documentation](https://render.com/docs) for more details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.