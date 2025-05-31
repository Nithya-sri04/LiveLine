# Liveline – Virtual Queue Management System

Liveline is a full-stack web application that allows businesses and users to manage queues efficiently through a virtual token system. Built using the MERN stack (MongoDB, Express, React, Node.js), the system enables businesses to reduce wait times and improve user experience by issuing virtual tokens with email notifications.

---

## 🚀 Features

### 🔒 Authentication & Security
- OTP-based signup with **email verification**
- Secure login for both **Users** and **Businesses**
- Role-based access handling for businesses and users

### 🏢 Business Dashboard
- Register and manage departments
- Issue and monitor real-time tokens
- View analytics for issued tokens and feedback

### 🙋 User Functionality
- Register and generate virtual tokens
- Receive **email notifications** when next in queue
- View current token status and estimated wait time

### 📈 Analytics
- View charts for token issuance and user feedback
- Track average processing time per token

### 🔧 Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Email Service:** Nodemailer
- **Scheduled Jobs:** NodeCron

---

## 📦 Installation

### 1. Clone the repository

git clone https://github.com/Nithya-sri04/liveline.git
cd liveline

### 2. Install dependencies


npm install       
cd client && npm install   

### 3. Set up environment variables
Create a .env file in the root and add the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password


🚀 Running the App

Start Backend
npm start

Start Frontend

cd client
npm start

The app will be available at http://localhost:3000.

📬 Email Notifications

Users receive an OTP for email verification during signup.
Token holders are notified via email when their turn is about to arrive.
Powered by Nodemailer and scheduled using NodeCron.

📊 Future Improvements

SMS Notifications using Twilio or similar services
Admin panel for monitoring all businesses
Mobile app integration (React Native or Flutter)


