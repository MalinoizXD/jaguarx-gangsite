# JAGUARX Gang Website 🎮

> เว็บไซต์อย่างเป็นทางการของแก๊ง JAGUARX จากเซิร์ฟเวอร์ Estelle (FiveM)

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Features

- 🏠 **หน้าแรกแบบ Animated** - Hero section พร้อม typing animation และ Framer Motion effects
- 👥 **ระบบสมาชิก** - แสดงรายชื่อสมาชิกในแก๊งพร้อมข้อมูลรายละเอียด
- 🔍 **ค้นหาสมาชิก** - ค้นหาสมาชิกได้อย่างรวดเร็ว
- 🔧 **Admin Panel** - ระบบจัดการสมาชิกสำหรับแอดมิน
- 🎵 **เพลงพื้นหลัง** - เล่นเพลงอัตโนมัติเพื่อสร้างบรรยากาศ
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) with Turbopack
- **Styling:** [TailwindCSS 4](https://tailwindcss.com)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Database:** [Supabase](https://supabase.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, หรือ bun

### Installation

1. Clone repository
```bash
git clone https://github.com/MalinoizXD/JAGUARX-gangsite.git
cd JAGUARX-gangsite
```

2. ติดตั้ง dependencies
```bash
npm install
# หรือ
yarn install
# หรือ
pnpm install
# หรือ
bun install
```

3. ตั้งค่า environment variables
```bash
# สร้างไฟล์ .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. รัน development server
```bash
npm run dev
# หรือ
yarn dev
# หรือ
pnpm dev
# หรือ
bun dev
```

5. เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## 📁 Project Structure

```
JAGUARX-gangsite/
├── src/
│   ├── app/
│   │   ├── admin/          # หน้า Admin Panel
│   │   ├── api/            # API Routes
│   │   ├── members/        # หน้าสมาชิก
│   │   ├── layout.tsx      # Root Layout
│   │   └── page.tsx        # หน้าแรก
│   ├── components/
│   │   ├── AnimatedHero.tsx    # Hero section หลัก
│   │   ├── AutoPlayMusic.tsx   # เล่นเพลงอัตโนมัติ
│   │   ├── MemberCard.tsx      # การ์ดสมาชิก
│   │   ├── Pagination.tsx      # Pagination
│   │   └── SearchBar.tsx       # ค้นหา
│   ├── contexts/          # React Contexts
│   └── lib/               # Utilities & Supabase client
├── public/
│   ├── uploads/           # รูปภาพอัปโหลด
│   └── music/             # ไฟล์เพลง
└── supabase-schema.sql    # Database schema
```

## 🤝 Partners

- **Esteniel**
- **Bangsaenclub**

## 👨‍💻 Created By

เว็บไซต์นี้สร้างด้วยความรัก ❤️ โดย [Mali Cloud](https://www.facebook.com/mali.temps/)

## 📄 License

This project is private and for JAGUARX gang members only.
