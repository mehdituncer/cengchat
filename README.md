﻿# Real-time Chat Application

A full-featured chat application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO.

## Features
DEMO: https://cengchat.onrender.com/
- 💬 Real-time messaging
- 🔐 User authentication
- 👤 Profile management
- 🖼️ Image sharing support
- 🟢 Online status indicators
- 👥 Multiple chat support
- 🌓 Light/Dark theme support

## Tech Stack

- **Frontend:** React.js, TailwindCSS, DaisyUI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.IO
- **State Management:** Zustand
- **Image Upload:** Cloudinary
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB account
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/chat-app.git
cd chat-app
```

2. Install dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Create .env file in backend directory with:
```env
MONGODB_URI=your_mongodb_uri
PORT=5001
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start development servers
```bash
# In root directory
npm run dev
```

## License

MIT License
# cengchat
