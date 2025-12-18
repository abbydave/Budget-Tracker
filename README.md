# 💰 Budget Tracker & Expense Manager

A full-stack personal finance application that helps users track income and expenses, set monthly budgets, and gain insights into their spending habits through summaries and visual analytics.

---

## 👥 Team Members

- **[Sokenu Abigail](https://github.com/abbydave)**
- **[Teslim Sadiq](https://github.com/Sadiq-Teslim)**
- **[Afunsho Olamide](https://github.com/OlamideAfunsho)**
- **[Ogunade Toheeb](https://github.com/qeinstein)**
- **[Noah Oyebola](https://github.com/NoahFola)**
- **[Oladipupo Stephen](https://github.com/oladipupostephen)**
- **[Daniel Umoh](https://github.com/Danielumoh)**
- **[Adalumo Mercy](https://github.com/Tammy080)**
- **[Ajiboye Precious](https://github.com/Ralia101)**
- **[Amaka Philomena](https://github.com/pheelandrea)**
- **[Ejide Ayodele David](https://github.com/Akinfola)**


## 🚀 Technologies Used

### Frontend
- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **pnpm** - Fast, disk space efficient package manager

### Backend
- **Node.js & Express.js** - Server runtime and web framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **bcrypt** - Password hashing and security

### APIs & Services
- **RESTful API** - Standard HTTP endpoints
- **Email Service** - OTP and password reset notifications

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v9 or higher) - Install via `npm install -g pnpm`
- **MongoDB** (local or cloud instance like MongoDB Atlas)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abbydave/Budget-Tracker.git
cd Budget-Tracker
```

---

## Backend Setup

### 2. Navigate to Backend Directory

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory using the `.env.sample` as a template:

```bash
cp .env.sample .env
```

Update `.env` with your configuration:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret_key_here



```

### 5. Start Backend Server

```bash
npm run dev
```

The backend API will be running at `http://localhost:5000/api`

---

## Frontend Setup

### 6. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 7. Install Dependencies

```bash
npm install
```

### 8. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://budget-tracker-nithub.onrender.com/api
```

### 9. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

---

## 📚 API Documentation

For detailed API endpoint documentation, see [Backend API Documentation](./backend/README.md)

### Base URLs
- **Development:** `http://localhost:5000/api`
- **Production:** `https://budget-tracker-nithub.onrender.com/api`

### Available Endpoints
- **Auth** - User registration, login, password reset
- **Profile** - Get and update user profile
- **Category** - Create, read, update, delete expense/income categories
- **Transaction** - Manage income and expense transactions
- **Budget** - Set and manage monthly budgets
- **Dashboard** - Analytics and spending insights

---

## 📁 Project Structure

```
Budget-Tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middlewares/      # Authentication, validation
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Database configuration
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies
│   └── README.md            # API documentation
│
└── frontend/
    ├── app/
    │   ├── Components/      # Reusable components
    │   ├── dashboard/       # Dashboard pages
    │   └── LandingPage/     # Landing page
    ├── components/          # Dashboard components
    ├── public/              # Static assets
    ├── .env.local           # Environment variables
    └── package.json         # Dependencies
```

---

## 🎯 Features

✅ **User Authentication** - Secure login/registration with JWT tokens
✅ **Income & Expense Tracking** - Record and categorize transactions
✅ **Budget Management** - Set monthly spending limits
✅ **Analytics Dashboard** - Visual insights into spending patterns
✅ **Category Management** - Create custom expense/income categories
✅ **Spending Trends** - Track spending over time
✅ **Password Reset** - Secure OTP-based password recovery
✅ **Responsive Design** - Works on desktop, tablet, and mobile


---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For support, please contact the development team or open an issue on GitHub.
