# Market Dashboard Application

## Overview

This is a full-stack financial market dashboard application built with React, Express, and TypeScript. The application provides real-time market data, economic indicators, monetary policy information, and global market insights through a modern, responsive web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with organized route handlers
- **Data Storage**: PostgreSQL with Drizzle ORM
- **External APIs**: Integration with Alpha Vantage and Polygon for market data
- **Caching**: In-memory caching for API responses with 5-minute TTL

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Shared schema definitions between client and server
- **Tables**: Market data, economic indicators, monetary policy, flows, global data, technical data, and news updates
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Data Models
- **Market Data**: Stock prices, changes, volume, and 52-week highs/lows
- **Economic Indicators**: GDP, inflation, unemployment with trend analysis
- **Monetary Policy**: Interest rates, policy stance, and meeting schedules
- **Investment Flows**: FII/DII data with period-based tracking
- **Global Markets**: International market indices and currency data
- **Technical Analysis**: RSI, MACD, support/resistance levels
- **News Updates**: Categorized financial news with timestamps

### Frontend Components
- **Dashboard**: Main view with tabbed navigation
- **Market Overview**: Real-time Sensex data with trend indicators
- **Economic Indicators**: Domestic economic metrics with visual trends
- **Monetary Policy**: RBI rates and policy stance information
- **Global Factors**: International markets, commodities, and currency data
- **Technical Analysis**: Chart indicators and market sentiment
- **News Feed**: Latest financial news with category filtering

### API Endpoints
- `/api/market/sensex` - BSE Sensex real-time data
- `/api/economic-indicators` - Domestic economic metrics
- `/api/monetary-policy` - RBI policy rates and stance
- `/api/global-markets` - International market indices
- `/api/commodities` - Commodity prices (gold, oil, etc.)
- `/api/currency` - USD/INR exchange rates
- `/api/flows` - FII/DII investment flows
- `/api/technical` - Technical analysis indicators
- `/api/news` - Financial news updates

## Data Flow

1. **External Data Sources**: Alpha Vantage and Polygon APIs provide market data
2. **Caching Layer**: Server-side caching reduces API calls and improves performance
3. **Database Storage**: Persistent storage for historical data and user-generated content
4. **REST API**: Express server exposes data through RESTful endpoints
5. **Client Queries**: React Query manages client-side data fetching and caching
6. **UI Updates**: Real-time updates through periodic refetching (30s-5min intervals)

## External Dependencies

### Third-Party APIs
- **Alpha Vantage**: Primary market data provider with demo key fallback
- **Polygon**: Secondary market data source for enhanced coverage
- **Web Scraping**: Cheerio for extracting data from financial websites

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Environment Variables**: API keys and database credentials via environment configuration

### UI Libraries
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for component variant styling
- **React Hook Form**: Form state management with validation

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast development builds
- **TypeScript Checking**: Continuous type checking during development
- **Replit Integration**: Custom plugins for Replit development environment

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built React app in production
- **Environment Detection**: Different configurations for development vs production

### Database Management
- **Schema Synchronization**: Drizzle Kit pushes schema changes to database
- **Migration Strategy**: Drizzle handles database schema versioning
- **Connection Pooling**: Neon serverless handles connection management automatically

### Performance Optimizations
- **API Caching**: 5-minute cache for external API responses
- **Query Optimization**: React Query provides client-side caching and background updates
- **Bundle Splitting**: Vite automatically splits code for optimal loading
- **Asset Optimization**: Tailwind CSS purging and PostCSS optimization