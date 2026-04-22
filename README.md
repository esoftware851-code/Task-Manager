## 📌 Task Manager App (Next.js + MongoDB)

A full-stack Task Management web application built using **Next.js** and **MongoDB (NoSQL database)**. This project allows users to efficiently create, manage, and track their daily tasks with a responsive and user-friendly interface.

### 🚀 Features

* ✅ Create, update, and delete tasks (CRUD operations)
* 📋 Organize tasks with titles, descriptions, and statuses
* 🔍 Filter and manage tasks easily
* 💾 Persistent data storage using MongoDB
* ⚡ Fast performance with server-side rendering (Next.js)
* 📱 Responsive design for desktop and mobile

### 🛠️ Tech Stack

* **Frontend & Backend:** Next.js (React Framework)
* **Database:** MongoDB (NoSQL)
* **Styling:** CSS / Tailwind (customizable)
* **API Handling:** Next.js API Routes

### 📂 Project Structure

* `/components` → Reusable UI components
* `/lib` → Database connection and utility functions
* `/models` → MongoDB schemas/models

### ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/Task-Manager.git

# Navigate into the project folder
cd tasker

# Install dependencies
npm install

# Create .env.local file and add your MongoDB URI
MONGODB_URI=your_mongodb_connection_string

# Run the development server
npm run dev
```

### 🌐 Usage

* Open `http://localhost:3000` in your browser
* Add new tasks, edit existing ones, or delete completed tasks
* All changes are stored in MongoDB in real-time

### 📌 Future Improvement
* 📅 Task deadlines
* 📊 Dashboard with analytics
