<div align="center">

# 🏆 Collabase

**Form balanced hackathon teams in minutes**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://collabase.vercel.app) • [Report Bug](https://github.com/Sharan986/collabase-/issues) • [Request Feature](https://github.com/Sharan986/collabase-/issues)

</div>

---

## 📋 About The Project

**Collabase** is a hackathon team formation platform built for **HACKHORIZON** at Arka Jain University. It solves the common problem of finding the right teammates by matching skills, goals, and availability.

### ✨ Key Features

- **🔐 Google Authentication** - Secure sign-in with Firebase Auth
- **📝 Smart Onboarding** - Guided profile setup with skills, role, and goals
- **🎯 Skill-Based Matching** - Find teammates with complementary skills
- **👥 Team Creation** - Create teams with up to 5 members
- **📨 Invite System** - Send and manage team invitations
- **🔍 Advanced Filters** - Search by year, course, gender, skills, and role
- **💬 Team Communication** - WhatsApp and Discord integration
- **📱 Fully Responsive** - Works seamlessly on all devices

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth (Google) |
| **Animations** | Framer Motion, GSAP |
| **Icons** | Lucide React, Tabler Icons |
| **Notifications** | Sonner |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sharan986/collabase-.git
   cd collabase-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
collabase-/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Team dashboard
│   ├── invites/            # Invitation management
│   ├── matchmaking/        # Team finding & creation
│   ├── onboarding/         # User profile setup
│   └── profile/            # Profile editing
├── components/             # Reusable UI components
│   ├── sections/           # Page sections
│   └── ui/                 # UI primitives
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & Firebase config
│   ├── constants.ts        # App constants (skills, roles, etc.)
│   ├── firebase.ts         # Firebase configuration
│   ├── firebase-context.tsx # Auth context provider
│   └── theme-utils.ts      # Styling utilities
└── public/                 # Static assets
```

---

## 🎮 User Flow

```
┌─────────────────┐
│   Landing Page  │
└────────┬────────┘
         │ Sign in with Google
         ▼
┌─────────────────┐
│   Onboarding    │ ← Set intent, skills, role, links
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│ Join  │ │  Create   │
│ Team  │ │   Team    │
└───┬───┘ └─────┬─────┘
    │           │
    ▼           ▼
┌───────────────────┐
│     Dashboard     │ ← Manage team, invites, requests
└───────────────────┘
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 🌟 Features in Detail

### For Team Creators
- Create a team with name, required skills, and goals
- Browse candidates looking to join teams
- Filter by year, course, gender, and skills
- Send invites and manage join requests
- Add WhatsApp/Discord links for communication

### For Team Joiners
- Browse available teams with open spots
- View team requirements and member count
- Send join requests to teams
- Accept or decline team invitations
- See skill match scores with teams

---

## 📱 Screenshots

<div align="center">

| Landing Page | Dashboard |
|:---:|:---:|
| Modern hero with animations | Team management interface |

| Matchmaking | Profile |
|:---:|:---:|
| Skill-based team discovery | Comprehensive profile editing |

</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Collabase Team** - [collabase.app@gmail.com](mailto:collabase.app@gmail.com)

Project Link: [https://github.com/Sharan986/collabase-](https://github.com/Sharan986/collabase-)

---

<div align="center">

**Built with ❤️ for HACKHORIZON at Arka Jain University**

</div>
