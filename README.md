# flatt.ie - Flatmate Finance Management App

## Overview

flatt.ie is a flatmate finance management app designed to simplify expense tracking, bill splitting, and financial management for shared household situations. With an intuitive interface and thoughtful features, flatt.ie helps flat finances stay out of the flat chat.

This was a group project that was completed up to its current state within the course of a week. Myself and 3 other Dev Academy students worked on this project. I was responsible for the Bills listing page, full-stack functionality for adding new bills and editing existing bills, the extensive bills search feature, and much of the UI. 

## Features

- **Dashboard**: Get an overview of your financial status, pending payments, and recent activities
- **Payments**: Toggle payments for bills. Only payments that are 30 days either side of today display here. 
- **Bill Management**: Track and manage shared bills with due dates and payment status
- **Expense Tracking**: Log and categorise individual and shared expenses
- **Flatmate Management**: Add and manage flatmates with profiles and payment preferences
- **Reports**: Generate detailed financial reports and visualiations of spending patterns
- **User Profiles**: Customise your profile with avatar and personal information
- **Authentication**: Secure login and user management with Auth0. Flat Financers can edit and delete expenses, bills, and payments.

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: Auth0
- **Visualisation**: Chart.js, React-ChartJS-2
- **UI Components**: Radix UI, Headless UI, Shadcn UI
- **Animation**: GSAP, Anime.js, Vanta.js for background effects
- **Build Tools**: Vite, ESBuild

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm 
- PostgreSQL (for production)

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/flatt.ie.git
cd flatt.ie
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_AUDIENCE=your-auth0-audience
DATABASE_URL=your-database-url
```

4. Run database migrations:
```
npm run knex migrate:latest
```

5. Start the development server:
```
npm run dev
```

You can find the server running on [http://localhost:3000](http://localhost:3000) and the client running on [http://localhost:5173](http://localhost:5173).

