# Power Plant Monitoring System Frontend

A modern, responsive web application built with Next.js 13+ (App Router), React, and shadcn/ui for monitoring power plant operations in real-time.

## Features

### Core Features
- 🔐 Authentication & Authorization
  - JWT-based authentication
  - Role-based access control
  - Protected routes
  - Persistent sessions

- 📊 Real-time Monitoring
  - Live sensor data visualization
  - Interactive charts and graphs
  - Real-time updates using SSE
  - Historical data analysis

- 🏭 Asset Management
  - Project-based organization
  - Asset hierarchical view
  - Component-level monitoring
  - Sensor data tracking

- ⚠️ Incident Management
  - Real-time incident tracking
  - Priority-based categorization
  - Incident history
  - Resolution tracking

### Technical Features
- ⚡ Next.js 13+ with App Router
- 🎨 Tailwind CSS for styling
- 🔧 shadcn/ui component library
- 📈 Recharts for data visualization
- 🔄 Real-time updates
- 🛡️ Middleware for route protection

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Running backend server

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd powerplant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
powerplant/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── dashboard/         # Dashboard routes
│   │   ├── login/            # Authentication pages
│   │   └── layout.js         # Root layout
│   ├── components/           # Reusable components
│   │   ├── ui/              # UI components (shadcn/ui)
│   │   └── app-sidebar.jsx  # Main sidebar navigation
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── hooks/              # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── api.js        # API service layer
│   │   └── utils.js      # Helper functions
│   └── styles/           # Global styles
├── public/              # Static assets
└── middleware.js       # Route protection middleware
```

## Key Components

### Authentication
- Login page with form validation
- JWT token management
- Protected route middleware
- User session persistence

### Dashboard
- Real-time sensor monitoring
- Asset hierarchy navigation
- Incident management interface
- Historical data analysis

### Data Visualization
- Real-time line charts
- Historical data trends
- Sensor status indicators
- Performance metrics

## State Management
- React Context for global state
- Custom hooks for data fetching
- Real-time updates with SSE
- Local storage for persistence

## Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent components
- Responsive design
- Dark mode support

## API Integration
- Centralized API service layer
- Axios for HTTP requests
- Error handling
- Request/response interceptors

## Security
- Protected routes with middleware
- JWT token validation
- XSS protection
- CORS configuration

## Development

### Available Scripts
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
```

### Code Style
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Consistent component structure

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration

NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000


# Authentication
NEXT_PUBLIC_JWT_EXPIRES_IN=3600 # 1 hour in seconds

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHAT=false

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=true
```

Make sure to:
1. Replace the placeholder values with your actual configuration
2. Keep the `.env.local` file secure and never commit it to version control
3. The `NEXT_PUBLIC_` prefix is required for variables to be exposed to the browser
4. Match the `NEXT_PUBLIC_API_URL` with your backend server URL

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Add your license here]

## Support
For support, email [your-email@example.com]
