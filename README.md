<div align="center">

# 📚 RECALIO

### *A Modern Spaced Repetition Flashcard Platform*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

RECALIO là nền tảng học từ vựng sử dụng thuật toán lặp lại ngắt quãng (Spaced Repetition — SM-2), cho phép người dùng tạo bộ thẻ, ôn tập theo lịch trình thông minh, và theo dõi tiến trình học tập. Hệ thống hỗ trợ nhiều loại mẫu thẻ (Basic, Basic Reversed, Cloze), tích hợp AI để sinh nội dung tự động, nhập liệu từ PDF và CSV, cùng cơ chế ôn tập dạng gõ đáp án (type-answer).

</div>

---

## 📋 Mục lục

- [✨ Tính năng](#-tính-năng)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📁 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [🚀 Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [⚙️ Biến môi trường](#️-biến-môi-trường)
- [📄 Các trang chính](#-các-trang-chính)
- [🔐 Xác thực & Phân quyền](#-xác-thực--phân-quyền)

---

## ✨ Tính năng

- 🗂️ **Quản lý bộ thẻ** – Tạo, clone, chia sẻ bộ thẻ công khai hoặc riêng tư
- 📝 **Tạo note thủ công** – Nhập từ vựng trực tiếp với đầy đủ ngữ nghĩa, IPA, loại từ, ví dụ
- 🤖 **AI sinh nội dung** – Tạo từ vựng tự động từ văn bản, chủ đề hoặc hình ảnh
- 📄 **Import từ PDF** – Upload tài liệu, AI trích xuất và tạo note hàng loạt
- 📊 **Import CSV** – Nhập danh sách từ vựng từ file CSV
- 🔄 **SM-2 Ôn tập thông minh** – Thuật toán lặp lại ngắt quãng với các mức Again/Hard/Good/Easy
- ⌨️ **Type-answer** – Ôn tập dạng gõ đáp án cho thẻ kiểu Basic
- 🔀 **Basic Reversed** – Mẫu thẻ tự động tạo chiều ngược lại
- 🔤 **Cloze** – Mẫu thẻ điền khuyết với highlight tự động
- 🖼️ **Hỗ trợ hình ảnh & âm thanh** – Hiển thị ảnh và phát audio ngay trên thẻ
- 📈 **Thống kê học tập** – Biểu đồ phân bố đánh giá, lịch sử phiên ôn tập
- 🏆 **Thành tích & Gamification** – Huy hiệu, điểm kinh nghiệm, bảng xếp hạng
- 👥 **Cộng đồng** – Chia sẻ bộ thẻ, theo dõi người dùng, bình luận và đánh giá
- 🛡️ **Bảng quản trị (Admin)** – Quản lý người dùng, bộ thẻ, báo cáo, mẫu thẻ, thành tích
- 🔔 **Thông báo** – Nhắc nhở ôn tập qua email và in-app

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16+ | Framework React với App Router |
| [React](https://reactjs.org/) | 19 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Type-safe JavaScript |
| [TailwindCSS](https://tailwindcss.com/) | 4 | Utility-first CSS framework |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state & caching |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5 | Lightweight state management |
| [Axios](https://axios-http.com/) | 1 | HTTP client với auto-refresh token |
| [Zod](https://zod.dev/) | 4 | Schema validation |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Recharts](https://recharts.org/) | 2 | Data visualization |
| [date-fns](https://date-fns.org/) | 4 | Date utilities |
| [Sonner](https://sonner.emilkowal.ski/) | 2 | Toast notifications |
| [Radix UI](https://www.radix-ui.com/) | - | Accessible UI primitives |
| [TanStack Table](https://tanstack.com/table) | 8 | Data table |
| [Lucide React](https://lucide.dev/) | 0.56 | Icons |

---

## 📁 Cấu trúc dự án

```
recalio_fe/
├── public/                        # Static assets
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (user)/                # Layout nhóm cho người dùng
│   │   │   ├── (home)/            # Trang chủ
│   │   │   ├── community/         # Cộng đồng (bài viết, bình luận)
│   │   │   ├── deck/              # Chi tiết bộ thẻ, tạo note, chỉnh sửa
│   │   │   │   └── [id]/
│   │   │   │       ├── create-notes/  # Tạo note (manual, AI, CSV, PDF)
│   │   │   │       ├── edit-cards/    # Chỉnh sửa thẻ
│   │   │   │       └── note/          # Components cho note
│   │   │   ├── document/          # Upload PDF → AI → tạo note
│   │   │   ├── profile/           # Hồ sơ cá nhân
│   │   │   ├── study/             # Ôn tập
│   │   │   │   ├── [deckId]/      # Phiên ôn tập
│   │   │   │   └── session/[id]/  # Chi tiết phiên học
│   │   │   └── suggestion/        # Gợi ý bộ thẻ
│   │   ├── admin/                 # Bảng quản trị
│   │   │   ├── achievement/       # Quản lý thành tích
│   │   │   ├── deck/              # Quản lý bộ thẻ
│   │   │   ├── deck-report/       # Báo cáo bộ thẻ
│   │   │   ├── notification/      # Quản lý thông báo
│   │   │   ├── overview/          # Dashboard tổng quan
│   │   │   ├── post/              # Quản lý bài viết
│   │   │   ├── suggestion/        # Quản lý gợi ý
│   │   │   └── template/          # Quản lý mẫu thẻ
│   │   ├── auth/                  # Xác thực (login, register, callback)
│   │   ├── layout.tsx             # Root layout
│   │   ├── not-found.tsx          # Trang 404
│   │   └── globals.css            # Global styles & theme variables
│   ├── components/
│   │   ├── admin/                 # Components cho admin (sidebar, table)
│   │   ├── common/                # Components dùng chung
│   │   │   ├── confirm/           # Confirm dialog
│   │   │   ├── skeleton/          # Skeleton loaders
│   │   │   └── title/             # Section title
│   │   ├── provider/              # Context / Provider (Auth, Query)
│   │   ├── ui/                    # Shadcn/ui components
│   │   └── user/                  # Components cho user (sidebar, header)
│   ├── constants/                 # Enums, mappings, types
│   ├── queries/                   # TanStack Query hooks (27 files)
│   ├── schemas/                   # Zod validation schemas (22 files)
│   ├── services/                  # API service classes (27 files)
│   ├── stores/                    # Zustand store (auth)
│   ├── utils/                     # Utilities (axios, mapping, timeAgo)
│   └── middleware.ts              # Next.js middleware (auth guard)
├── .env                           # Biến môi trường
├── next.config.ts                 # Cấu hình Next.js
├── package.json
└── tsconfig.json
```

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x

### Bước 1: Clone dự án

```bash
git clone https://github.com/henruysun2511/recalio.git
cd recalio_fe
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc:

```bash
cp .env.example .env
```

Sau đó cập nhật các giá trị trong file `.env` (xem phần [Biến môi trường](#️-biến-môi-trường)).

### Bước 4: Chạy môi trường phát triển

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### Build cho Production

```bash
npm run build
npm run start
```

### Lint code

```bash
npm run lint
```

---

## ⚙️ Biến môi trường

Tạo file `.env` ở thư mục gốc dự án với nội dung sau:

```env
# URL API của backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Secret key để xác thực JWT (dùng trong middleware)
ACCESS_TOKEN_SECRET=your_secret_key_here
```

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL của REST API backend | `http://localhost:4000/api/v1` |
| `ACCESS_TOKEN_SECRET` | Secret key dùng để verify JWT trong middleware | `your_secret_key` |

> **Lưu ý:** Các biến có tiền tố `NEXT_PUBLIC_` sẽ được expose ra phía client.

---

## 📄 Các trang chính

### Người dùng

| Route | Mô tả | Yêu cầu đăng nhập |
|---|---|---|
| `/` | Trang chủ | ❌ |
| `/study` | Danh sách bộ thẻ & thống kê ôn tập | ✅ |
| `/study/[deckId]` | Phiên ôn tập (flashcard + type-answer) | ✅ |
| `/study/session/[id]` | Chi tiết phiên học | ✅ |
| `/deck` | Khám phá bộ thẻ công khai | ❌ |
| `/deck/[id]` | Chi tiết bộ thẻ (overview, notes, cards, reviews, sessions) | ❌ |
| `/deck/[id]/create-notes` | Tạo note mới (manual, AI, CSV, PDF) | ✅ |
| `/deck/[id]/edit-cards` | Chỉnh sửa thẻ (sidebar deck list, preview, edit) | ✅ |
| `/document` | Upload PDF → AI trích xuất → tạo note hàng loạt | ✅ |
| `/profile` | Hồ sơ cá nhân (thống kê, thành tích, bộ thẻ, bài viết) | ✅ |
| `/profile/[username]` | Hồ sơ công khai của người dùng khác | ❌ |
| `/community` | Cộng đồng (bài viết, bình luận) | ❌ |
| `/suggestion` | Gợi ý bộ thẻ | ✅ |

### Xác thực

| Route | Mô tả | Yêu cầu đăng nhập |
|---|---|---|
| `/auth/login` | Đăng nhập | ❌ |
| `/auth/register` | Đăng ký | ❌ |
| `/auth/callback` | OAuth callback (Google) | ❌ |

### Admin

| Route | Mô tả | Yêu cầu |
|---|---|---|
| `/admin/overview` | Dashboard tổng quan | Admin |
| `/admin/deck` | Quản lý bộ thẻ | Admin |
| `/admin/deck-report` | Quản lý báo cáo bộ thẻ | Admin |
| `/admin/template` | Quản lý mẫu thẻ (note + card template) | Admin |
| `/admin/achievement` | Quản lý thành tích / huy hiệu | Admin |
| `/admin/notification` | Quản lý thông báo | Admin |
| `/admin/post` | Quản lý bài viết cộng đồng | Admin |
| `/admin/suggestion` | Quản lý gợi ý | Admin |

---

## 🔐 Xác thực & Phân quyền

Dự án sử dụng **JWT (JSON Web Token)** lưu trong cookie (`accessToken`) để xác thực người dùng. Hỗ trợ đăng nhập bằng email/password và Google OAuth.

### Luồng xác thực (Middleware)

```
Request đến
    │
    ├─ Trang Auth (Login/Register) + Có token hợp lệ → Redirect về "/"
    │
    ├─ Trang Public (/, /deck, /community, ...) → Cho qua
    │
    ├─ Trang cần đăng nhập (/study, /profile, /document) + Không có token → Redirect về "/auth/login"
    │
    ├─ Trang Admin (/admin) + Không có token → Redirect về "/auth/login"
    │
    ├─ Trang Admin (/admin) + Có token nhưng không phải ADMIN → Redirect về "/"
    │
    └─ Có token nhưng hết hạn → Xóa cookie + Redirect về "/auth/login"
```

### Phân quyền

- **Guest** – Xem trang chủ, khám phá bộ thẻ công khai, cộng đồng, hồ sơ công khai
- **User** – Tất cả tính năng Guest + tạo bộ thẻ, ôn tập, nhập liệu, quản lý hồ sơ, theo dõi người dùng
- **Admin** – Toàn quyền + truy cập bảng quản trị `/admin`

---

<br>
<div align="center">

Made by **NHAT HUY**

</div>
