# Ship Maintenance Management System

A comprehensive web application for managing ship maintenance operations, built with React, TypeScript, and Material-UI.

## Features

- 📊 Interactive Dashboard with key metrics
- 🚢 Ship Management with detailed information
- 🔧 Maintenance Job Tracking
- 📅 Calendar View for Maintenance Scheduling
- 👥 User Management with Role-based Access
- 🌓 Dark/Light Theme Support
- 📱 Responsive Design

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- MUI X Date Pickers
- React Router
- Context API for State Management

## Getting Started

### Prerequisites

- Node.js 16.x or later
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ship-maintenance
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## Login Credentials

### Admin User
- Email: admin@entnt.in
- Password: admin123

### inspector User
- Email: inspector@entnt.in
- Password: inspect123

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Vercel will automatically detect the React configuration and deploy the application

## Project Structure

```
ship-maintenance/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Project dependencies
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
