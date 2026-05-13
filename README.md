# SocratesHQ | Elite Career Intervention Platform

SocratesHQ is a high-performance career mentorship and resource platform engineered for the next generation of global leaders. It provides a tactical ecosystem for professional growth, connecting visionaries with vetted mentors and premium career-advancement resources.

## 🚀 Key Features

- **Strategic Mentor Discovery**: Advanced filtering and search for top-tier global talent.
- **Elite Profile Systems**: Comprehensive mentor profiles with session history, specialties, and social integration.
- **Dynamic Resource Marketplace**: Access to FAANG-grade masterclasses and technical engineering resources.
- **Secure Authentication**: Robust identity management using Firebase with server-side session persistence.
- **Tactical Obsidian UI**: A premium, dark-first design system built with Tailwind CSS 4 and Lucide Icons.
- **Intelligent Routing**: Automated role-based access control and layout segmentation.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd career-intervention-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase and API configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_URL=your_backend_url
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🗺️ Route Summary

### Public Routes (Accessible to all)
- `/` - **Home**: High-conversion landing page.
- `/about` - **About**: Mission and philosophy of SocratesHQ.
- `/items` - **Resources**: Marketplace for career masterclasses.
- `/consultation` - **Discovery**: Talent acquisition and mentor search.
- `/login` / `/register` - **Auth**: Identity entry points.

### Protected Routes (Requires Authentication)
- `/items/[id]` - **Resource Details**: Full access to item specifications.
- `/mentors/[id]` - **Mentor Profile**: Deep-dive into mentor expertise and booking.
- `/dashboard` - **User Dashboard**: Role-specific workspace for Mentees/Mentors.
- `/my-profile` - **Profile Settings**: Personal identity management.

## 🔑 Master Admin Credentials

For evaluation of the administrative dashboard (Mentor Vetting, User Directory, etc.), please use the following Master Admin account. This account is configured for standard email/password authentication.

- **Email**: `admin@socrateshq.com`
- **Password**: `AdminSocrates2026!`
- **Role**: `ADMIN`

---
*Engineered for precision. Optimized for results.*

