# Shared Flat Expense Tracker

A modern, real-time expense tracking application for shared flats.

## Prerequisites

You need to have **Node.js** installed on your computer to run this application.
Download it from: [https://nodejs.org/](https://nodejs.org/)

## Setup Instructions

1. **Install Dependencies**
   Open your terminal/command prompt in this folder and run:
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database** (Start in Test Mode)
   - Go to Project Settings > General > Your apps > Web app
   - Copy the `firebaseConfig` object
   - Open `src/firebase.config.js` in this project
   - Replace the placeholder values with your actual configuration

3. **Run the Application**
   ```bash
   npm run dev
   ```
   Open the link shown in the terminal (usually http://localhost:5173)

## Features

- **Authentication**: Sign up and login for 4 flatmates
- **Dashboard**: View monthly totals and your balance
- **Add Expense**: Track Rent, Food, Water, Electricity
- **Real-time Sync**: Updates appear instantly for all users
- **Split Logic**: Total expenses are always divided by 4

## Deployment

To deploy on Vercel:
1. Push this code to GitHub
2. Import the project in Vercel
3. It will automatically detect Vite and deploy!
