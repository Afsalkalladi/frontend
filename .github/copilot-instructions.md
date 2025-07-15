# EESA Frontend Development Instructions

## Project Overview

This is the frontend application for the Electrical and Electronics Students Association (EESA) platform. It's built with Next.js 15, TypeScript, and Tailwind CSS, providing a role-based interface for students, teachers, alumni, and tech heads.

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Authentication**: JWT-based with role-based access control
- **UI Components**: Custom components with Lucide React icons
- **Toast Notifications**: React Hot Toast

## Features Implemented

- ✅ Universal responsive navbar with role-based navigation
- ✅ JWT authentication system with token refresh
- ✅ Role-based UI (Student, Teacher, Alumni, Tech Head)
- ✅ Home page with dynamic content based on auth status
- ✅ Digital Library with filtering and search
- ✅ Events & Workshops listing with registration
- ✅ Career Opportunities board
- ✅ About page with team and mission information
- ✅ Login page with form validation

## User Roles & Permissions

- **Students**: Access library, events, career opportunities, upload notes, create projects
- **Teachers**: All student permissions + approve notes, create events
- **Alumni**: Similar to students + post career opportunities
- **Tech Heads**: Full admin access to all features

## Key Components

- `src/components/layout/Navbar.tsx` - Universal navigation
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/lib/api.ts` - API client with token refresh
- `src/utils/auth.ts` - Token storage and validation utilities

## Pages Implemented

- `/` - Home page with role-based content
- `/login` - Authentication page
- `/library` - Digital library with notes and materials
- `/events` - Events and workshops
- `/career` - Career opportunities
- `/about` - About EESA organization

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```

## Development Workflow

1. **Start Development Server**: `npm run dev` (with Turbopack)
2. **Build for Production**: `npm run build`
3. **Lint Code**: `npm run lint`
4. **Start Production**: `npm start`

## Code Standards

- Use TypeScript strictly with proper type definitions
- Follow React functional components with hooks
- Implement proper error handling with toast notifications
- Use Tailwind CSS for styling with custom utility classes
- Maintain responsive design for all screen sizes
- Follow role-based access control patterns

## API Integration

The frontend is designed to work with a Django REST API backend. Mock data is currently used for development, but all components are ready for API integration with:

- Authentication endpoints (`/auth/login/`, `/auth/refresh/`)
- User management (`/auth/user/`)
- Notes, Events, Career, and Project endpoints

## Deployment Ready

- Optimized for Vercel deployment
- Uses Next.js 15 features for performance
- Implements proper error boundaries and loading states
- Environment-based configuration

## Future Enhancements

- Notes upload functionality (`/notes/upload`)
- Notes verification for teachers (`/notes/verify`)
- Project creation and management (`/projects/create`, `/projects/:id`)
- User registration flow
- File upload capabilities
- Real-time notifications
- Advanced search and filtering
- User profiles and settings

## VS Code Configuration

- Tasks.json configured for development workflow
- Recommended extensions: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense, TypeScript Importer

## Contributing

1. Follow the established code structure and patterns
2. Ensure all new features are responsive and accessible
3. Add proper TypeScript types for new components/utilities
4. Test role-based functionality across different user types
5. Maintain consistency with the existing design system
