# DonateChain

A comprehensive platform for managing donations, volunteers, and community engagement with blockchain integration for transparent monetary donations.

## Overview

DonateChain is a full-stack web application built with Next.js that connects donors with volunteers to facilitate both monetary and physical donations. The platform includes role-based access for admins, donors, and volunteers, with a blockchain component to ensure transparency in financial transactions.

### Key Features

- **User Authentication & Roles**: Support for Admin, Donor, and Volunteer roles with secure authentication
- **Monetary Donations**: Blockchain-recorded donations via bKash/Nagad with transaction transparency
- **Physical Donations**: Donors can submit physical donation requests that volunteers can fulfill
- **Volunteer Management**: Admins can approve/reject volunteer applications and assign tasks
- **Task Management**: Volunteers receive tasks to collect physical donations with deadline tracking
- **Feedback System**: Donors can rate and review volunteer services
- **Real-time Notifications**: Users receive notifications for important events
- **Admin Dashboard**: Comprehensive overview with statistics, user management, and transaction ledger
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS and Radix UI components

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework


### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens

### Blockchain
- **Custom Blockchain Implementation** - Simple proof-of-work blockchain for donation recording
- **Crypto (Node.js)** - Hashing and cryptography



## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (auth, donations, etc.)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── donor/            # Donor-specific components
│   └── volunteer/        # Volunteer-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── auth-context.tsx  # Authentication context
│   ├── mongodb.ts        # Database connection
│   ├── store.ts          # Data store layer
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── server/               # Express.js backend
│   ├── blockchain/       # Blockchain implementation
│   ├── models/           # Mongoose models
│   └── routes/           # API route handlers
└── styles/               # Additional styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd donatechain
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/donatechain
   JWT_SECRET=your-jwt-secret-key
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```

5. **Run the development servers**

   Start the backend server:
   ```bash
   cd server
   node index.js
   ```

   In a new terminal, start the frontend:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Seeding

The application automatically seeds the database with sample data on first run if the database is empty. This includes:
- Admin user account
- Sample donors and volunteers
- Example donations and tasks

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request

### Donations
- `POST /api/donations/monetary` - Create monetary donation
- `POST /api/donations/physical` - Create physical donation request
- `GET /api/donations` - Get all donations
- `PUT /api/donations/:id/status` - Update donation status

### Volunteers
- `POST /api/volunteers` - Volunteer registration
- `GET /api/volunteers` - Get all volunteers
- `PUT /api/volunteers/:id/status` - Approve/reject volunteer

### Tasks
- `POST /api/tasks` - Create task for volunteer
- `GET /api/tasks` - Get tasks
- `PUT /api/tasks/:id/status` - Update task status

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Statistics
- `GET /api/stats` - Get platform statistics

## User Roles & Permissions

### Admin
- Full access to all features
- User management (approve/reject volunteers)
- View all donations, tasks, and feedback
- Access to transaction ledger
- Platform statistics and analytics

### Donor
- Make monetary and physical donations
- View donation history
- Submit feedback for completed tasks
- Receive notifications

### Volunteer
- Apply for volunteer status (requires admin approval)
- View and accept assigned tasks
- Update task status with proof photos
- View feedback received

## Blockchain Integration

Monetary donations are recorded on a custom blockchain implementation:
- Each donation creates a new block
- Blocks are mined with proof-of-work (difficulty: 2)
- Transaction hash and block number are stored with each donation
- Ensures transparency and immutability of financial records

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Quality

The project uses ESLint for code linting. Run `pnpm lint` to check for issues.

### Database Models

- **User**: Authentication and profile data
- **MonetaryDonation**: Financial donations with blockchain data
- **PhysicalDonation**: Non-monetary donation requests
- **Task**: Volunteer assignments for physical donations
- **Feedback**: Donor reviews of volunteer services
- **Notification**: User notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with external payment gateways
- [ ] Mobile app development
- [ ] Real-time chat between donors and volunteers
- [ ] Advanced blockchain features (smart contracts, tokenization)


<!-- pnpm dev > /dev/null 2> -->
<!-- pnpm build && pnpm start -->
