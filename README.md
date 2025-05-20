# 📝 Blog-Up Frontend

This is the frontend part of a full-stack blog application built using **Next.js**, **React 19**, **Redux Toolkit**, **Material UI**, and **TypeScript**. The app allows users to view, create, update, and delete blog posts, as well as add comments.

## 📽️ Demo

[Watch demo video](https://youtu.be/tDdf4KkAD3A)

## 🚀 Features

* 📄 View all blog posts
* 🗒️ View a single post with comments
* ✍️ Create a new post
* ✏️ Edit an existing post
* ❌ Delete a post
* 💬 Add comments to a post
* ✅ Client-side input validation
* 🔔 Error message handling

## 🧰 Tech Stack

* **Next.js**
* **React**
* **Redux Toolkit**
* **TypeScript**
* **Material UI v7**
* **Ant Design**
* **Tailwind CSS**
* **Emotion Styled Components**
* **JWT Decode**
* **lodash.debounce**
* **WebSocket** for updating list of comments in realtime

## 📦 Installation

```bash
git clone https://github.com/vlasiuk-anatolii/blog-up-front
cd blog-up-front
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

Create a `.env` file in the current directory with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lf**************************
```

## 📁 Project Structure

```
front/
├── app/
│ ├── auth/ // Authentication pages and logic
│ ├── comments/ // Comment-related pages and logic
│ ├── common/ // Shared components/utilities
│ ├── header/ // Header layout and navigation
│ ├── posts/ // Post-related pages (CRUD)
│ ├── search/ // Search functionality
│ ├── store/ // Redux store and slices
│ ├── dark.theme.ts // Custom MUI dark theme
│ └── globals.css // Global CSS styles
├── .next/ // Next.js build output (auto-generated)
├── package.json // Project metadata and dependencies
├── tailwind.config.js // Tailwind CSS configuration
└── tsconfig.json // TypeScript configuration
```

## ✅ Implemented

* [x] Display all posts
* [x] View a post with comments
* [x] Create a new post
* [x] Edit a post
* [x] Delete a post
* [x] Add comments to a post
* [x] Add files to comments
* [x] Resizing image of comment to 320x240
* [x] Sanitize html in comment
* [x] Filter comments
* [x] Add files to comments

* [x] Preview comment
* [x] Pagination comments
* [x] Displaying comments in realtime
* [x] Client-side validation
* [x] Error handling
* [x] Search of posts (basic)
* [x] Responsive design

## 📝 Notes

* The backend should be running on `http://localhost:3001` or the address set in `NEXT_PUBLIC_API_URL`.
* All forms include basic validation with helpful error messages.

## 📄 License

MIT © 2025 [Anatolii Vlasiuk](https://github.com/vlasiuk-anatolii)
