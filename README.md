# KOREM GKI Pamulang — Youth Attendance System

A production-ready, mobile-first web application for managing youth community attendance at KOREM GKI Pamulang. Built with React, Vite, and Supabase.

## Features

- **QR-Based Attendance**: Admin creates a session → generates a QR code → teenagers scan and submit attendance
- **Grade 7–12 Class Selection**: Strict validation across frontend, backend, and database
- **Database-Level Duplicate Prevention**: Normalized name matching prevents duplicate entries
- **Real-Time Dashboard**: Attendance statistics with grade breakdown
- **Session Management**: Create, monitor, and close attendance sessions
- **Export**: Download attendance records as CSV or Excel
- **Mobile-First Design**: Optimized for 360px–430px screens
- **Secure**: Supabase Auth + Row Level Security + SECURITY DEFINER RPCs

## Tech Stack

- **Frontend**: React + Vite + React Router
- **Backend**: Supabase (PostgreSQL, Auth, RLS, RPC)
- **Icons**: Lucide React
- **Export**: SheetJS (xlsx)
- **QR Code**: qrcode
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd absensi

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env` to version control. Only `.env.example` should be tracked.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **Anon Key** from Settings → API

### 2. Run Database Migrations

Execute the SQL migration files in order in the Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql` — Creates tables (profiles, sessions, attendance)
2. `supabase/migrations/002_rls_policies.sql` — Enables Row Level Security policies
3. `supabase/migrations/003_indexes.sql` — Creates performance indexes
4. `supabase/migrations/004_rpc_functions.sql` — Creates submit_attendance and get_session_for_attendance RPCs

### 3. Configure Authentication

1. Go to Authentication → Settings
2. Disable email confirmations for easier admin setup (optional)
3. Add your production domain to the redirect URLs

### 4. Create First Administrator

1. Go to Authentication → Users → Add User
2. Create a user with email and password
3. Note the user's UUID
4. In the SQL Editor, insert their admin profile:

```sql
INSERT INTO profiles (id, email, full_name, role)
VALUES ('USER-UUID-HERE', 'admin@example.com', 'Admin Name', 'admin');
```

### 5. Add Environment Variables

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file.

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 3. Add Environment Variables

In Vercel project settings → Environment Variables:

- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 4. Deploy

Click Deploy. The `vercel.json` file handles SPA routing automatically.

### 5. Configure Custom Domain

1. In Vercel → Settings → Domains → Add your domain
2. Update DNS records as instructed
3. In Supabase → Authentication → URL Configuration:
   - Add your custom domain to **Redirect URLs**: `https://your-domain.com/**`

### 6. Test

- [ ] Admin login works
- [ ] Create a session
- [ ] Generate QR code (URL should use production domain)
- [ ] Scan QR from phone → attendance form loads
- [ ] Submit attendance → success screen
- [ ] Check attendance appears in admin dashboard
- [ ] Export attendance to Excel/CSV
- [ ] Close session → public page shows "Attendance Closed"

---

## Google Sheets Sync (Optional)

The application architecture supports Google Sheets synchronization:

```
Teenager → QR → Supabase (primary) → Google Sheets (sync)
```

To implement:
1. Create a Google Cloud service account with Sheets API access
2. Set up a Supabase Edge Function for sync
3. Store service account credentials as Supabase secrets (never in frontend)
4. Sync runs after each successful attendance submission

If Google Sheets is temporarily unavailable, attendance is safely stored in Supabase.

---

## Data Flow

```
Admin Creates Session
        ↓
Generate Unique QR
        ↓
Teenager scans QR
        ↓
/attendance/session/{sessionId}
        ↓
Enter: Name, Grade 7–12, Gender
        ↓
SUBMIT
        ↓
Supabase RPC: submit_attendance()
  → Validate session (exists, OPEN)
  → Validate class (Grade 7–12)
  → Validate gender (MALE/FEMALE)
  → Normalize name
  → Check duplicate
  → Insert attendance
        ↓
SUCCESS / DUPLICATE / ERROR
```

---

## Class Validation

Grade selection is strictly locked to:

| Grade    |
|----------|
| Grade 7  |
| Grade 8  |
| Grade 9  |
| Grade 10 |
| Grade 11 |
| Grade 12 |

Enforced at:
- Frontend: `<select>` dropdown with fixed options
- Shared constant: `CLASS_OPTIONS` in `src/constants/classOptions.js`
- Backend RPC: `submit_attendance()` validates against the same list
- Database: `CHECK` constraint on `attendance.class_name`

---

## Project Structure

```
src/
├── assets/          # Logo and static assets
├── components/
│   ├── ui/          # Reusable UI components
│   ├── forms/       # Form components
│   ├── qr/          # QR code display
│   └── admin/       # Admin-specific components
├── constants/       # Shared constants (CLASS_OPTIONS)
├── hooks/           # React hooks (useAuth, useAttendance)
├── layouts/         # AdminLayout, MobileLayout
├── lib/             # Supabase client
├── pages/
│   ├── attendance/  # Public attendance page
│   ├── auth/        # Admin login
│   └── admin/       # Admin dashboard, sessions, attendance, QR, settings
├── routes/          # RequireAuth guard
├── services/        # API services
├── styles/          # CSS variables, global styles, print styles
└── utils/           # Validation, date utilities
```

---

## Timezone

All timestamps are stored in UTC. Display times are converted to **Asia/Jakarta (UTC+7)** for the UI and exports.

---

## License

Private — KOREM GKI Pamulang
