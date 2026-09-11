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


