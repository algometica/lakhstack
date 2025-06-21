# BesharamList

A modern listing platform built with Next.js, featuring custom authentication and admin controls.

## Features

- **Custom Authentication**: JWT-based authentication system with bcrypt password hashing
- **Admin Panel**: Complete control over listings and users
- **User Management**: Secure user registration and login
- **Listing Management**: Create, edit, and manage business listings
- **Responsive Design**: Modern UI with Tailwind CSS
- **Database**: Supabase for data storage and management

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: JWT, bcryptjs
- **Database**: Supabase
- **UI Components**: Radix UI, Lucide React icons
- **Forms**: Formik
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd besharam-list
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin User
```

4. Set up the database and admin user:
```bash
node scripts/setup-admin.js
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication System

### Features
- **JWT-based authentication** with secure HTTP-only cookies
- **Password hashing** using bcrypt with 12 salt rounds
- **Role-based access control** (user/admin)
- **Automatic session management**
- **Protected routes** with middleware

### User Roles
- **User**: Can create and manage their own listings
- **Admin**: Full access to admin panel, can manage all listings and users

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

## Admin Panel

### Features
- **Complete listing management**: View, edit, activate/deactivate, delete listings
- **User management**: View and delete users
- **Real-time updates**: Instant feedback on actions
- **Responsive design**: Works on all devices

### Access
- Only users with `admin` role can access `/admin`
- Automatic redirect for non-admin users

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Listings Table (existing)
- Enhanced with user relationship via `created_by` field

## Security Features

- **JWT tokens** with 7-day expiration
- **HTTP-only cookies** for token storage
- **Password hashing** with bcrypt
- **Role-based middleware** protection
- **Input validation** on all forms
- **CSRF protection** via same-site cookies

## Deployment

### Environment Variables for Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_API_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
```

### Build and Deploy
```bash
npm run build
npm start
```

## Migration from Clerk

This project has been migrated from Clerk authentication to a custom JWT-based system. Key changes:

1. **Removed Clerk dependencies** from package.json
2. **Replaced Clerk components** with custom authentication
3. **Added admin functionality** for complete control
4. **Enhanced security** with custom JWT implementation
5. **Improved user management** with role-based access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
