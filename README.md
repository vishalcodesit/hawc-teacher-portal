# HAWC Teacher Management Portal

A full-stack MERN application with JWT-based authentication and teacher management.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js                 |
| Frontend  | React.js, React Router v6           |
| Database  | MongoDB (Mongoose ODM)              |
| Auth      | JWT (JSON Web Tokens) + bcryptjs    |
| HTTP      | Axios                               |

---

## Project Structure

```
hawc-project/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── models/
│   │   │   ├── AuthUser.js       # auth_user collection
│   │   │   └── Teacher.js        # teachers collection (1-1 with AuthUser)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── teacherController.js
│   │   ├── middleware/auth.js    # JWT protect middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── teacherRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── api/axios.js          # Axios instance with token interceptor
    │   ├── context/AuthContext.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Teachers.js       # Datatable for teachers collection
    │   │   ├── Users.js          # Datatable for auth_user collection
    │   │   └── AddTeacher.js     # Single POST → both collections
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## API Endpoints

### Auth Routes (Public)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/register    | Register new user  |
| POST   | /api/auth/login       | Login & get token  |

### Auth Routes (Protected — Bearer Token required)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/auth/profile     | Get logged-in user |

### Teacher Routes (All Protected)
| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | /api/teachers         | Create user + teacher (single POST)  |
| GET    | /api/teachers         | Get all teachers (with user data)    |
| GET    | /api/teachers/users   | Get all auth_users                   |
| GET    | /api/teachers/:id     | Get single teacher                   |
| DELETE | /api/teachers/:id     | Delete teacher + user                |

---

## ⚙️ Step-by-Step Execution Guide

### Prerequisites
- Node.js v18+ installed → https://nodejs.org
- MongoDB installed locally → https://www.mongodb.com/try/download/community
  OR use MongoDB Atlas (free cloud DB) → https://www.mongodb.com/atlas
- Git installed → https://git-scm.com

---

### Step 1 — Clone / Setup the project folder

If starting fresh (not cloning):
```bash
# Navigate to where you want the project
cd ~/Desktop
# The folder is already created as hawc-project/
```

---

### Step 2 — Setup the Backend

```bash
# Go into backend folder
cd hawc-project/backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Now open `.env` and fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hawc_db
JWT_SECRET=replace_this_with_a_long_random_string_abc123xyz
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

> **Using MongoDB Atlas?** Replace MONGO_URI with your Atlas connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hawc_db`

Start the backend:
```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

---

### Step 3 — Setup the Frontend

Open a **new terminal tab/window**:

```bash
cd hawc-project/frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The app opens automatically at **http://localhost:3000**

---

### Step 4 — Test the App

1. Go to http://localhost:3000/register → Create your account
2. Login at http://localhost:3000/login
3. View the Dashboard with stats
4. Go to **Add Teacher** → Fill the form → Submits to BOTH collections in one POST
5. View **Teachers** page → Datatable with search + pagination + delete
6. View **Users** page → Datatable of auth_user collection

---

### Step 5 — Upload to GitHub

#### 5a. Create two repositories on GitHub
1. Go to https://github.com → Click **New repository**
2. Create repo named: `hawc-backend` (set to Public)
3. Create another repo named: `hawc-frontend` (set to Public)

#### 5b. Push Backend

```bash
cd hawc-project/backend

# Initialize git
git init

# Add all files (the .gitignore will exclude node_modules and .env)
git add .

# First commit
git commit -m "Initial commit: Express + MongoDB backend with JWT auth"

# Link to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/hawc-backend.git

# Push
git branch -M main
git push -u origin main
```

#### 5c. Push Frontend

```bash
cd hawc-project/frontend

git init
git add .
git commit -m "Initial commit: React frontend with auth + teacher management"
git remote add origin https://github.com/YOUR_USERNAME/hawc-frontend.git
git branch -M main
git push -u origin main
```

> **Note:** When prompted for credentials, use your GitHub username and a **Personal Access Token** (not your password).  
> Generate one at: GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)

---

### (Optional) Export MongoDB Data

To include a DB export in the repository:

```bash
# Export collections as JSON
mongodump --db hawc_db --out ./hawc-project/db-export/

# OR export as JSON files
mongoexport --db hawc_db --collection authusers --out db_export/authusers.json
mongoexport --db hawc_db --collection teachers --out db_export/teachers.json
```

Add the `db-export/` folder to your backend repo commit.

---

## Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds) before storage
- JWT tokens expire in **7 days** (configurable in .env)
- All teacher/data routes require a valid Bearer token
- Transactions ensure atomic writes to both collections (create/delete)
- `.env` file is gitignored — never commit secrets
