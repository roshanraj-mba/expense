# Multi-Group Expense Tracker

A modern, scalable expense tracking application with multi-group support, flexible expense splitting, and real-time group chat.

## Features

- **Multi-Group Support**: Create and manage multiple expense groups (e.g., "Flatmates", "Trip to Goa", "Office Lunch")
- **Custom Members**: Each group has its own set of members
- **Flexible Expense Splitting**:
  - **Equal Split**: Automatically divide expenses equally among selected members
  - **Percentage Split**: Set custom percentages for each member
  - **Custom Amount Split**: Specify exact amounts for each member
- **Group Chat**: Real-time messaging within each group
- **Real-time Sync**: All changes appear instantly for all group members
- **Mobile-Friendly**: Responsive design that works beautifully on all devices
- **Modern UI**: Sleek, vibrant design with smooth animations

## Prerequisites

You need **Node.js** installed on your computer to run this application.
Download it from: [https://nodejs.org/](https://nodejs.org/)

## Setup Instructions

### 1. Install Dependencies

Open your terminal/command prompt in this folder and run:
```bash
npm install
```

### 2. Configure Firebase

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project (or use existing one)
- Enable **Authentication** (Email/Password provider)
- Enable **Firestore Database** (Start in Production Mode)
- Set up Firestore Security Rules (see below)
- Go to Project Settings > General > Your apps > Web app
- Copy the `firebaseConfig` object
- Open `src/firebase.config.js` in this project
- Replace the placeholder values with your actual configuration

### 3. Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.members.keys();
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.members[request.auth.uid].role == 'admin';
    }
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.paidBy == request.auth.uid;
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Run the Application

```bash
npm run dev
```

Open the link shown in the terminal (usually http://localhost:5173)

## How to Use

### Getting Started

1. **Sign Up**: Create an account with your email and password
2. **Create a Group**: Click the group selector in the header and create your first group
3. **Invite Members**: Share the group with others by having them sign up and you can add them via email

### Adding Expenses

1. Click **"Add Expense"** button
2. Enter description and amount
3. Select category (Rent, Food, Water, Electricity, Other)
4. Choose split type:
   - **Equal**: Splits evenly among all selected members
   - **Percentage**: Set custom percentages (must total 100%)
   - **Custom Amount**: Enter exact amounts (must total expense amount)
5. Select which members to include in the split
6. Click **"Add Expense"**

### Group Chat

- Click the chat icon in the header to open group chat
- Send messages to communicate with group members
- Expense notifications appear automatically in chat

### Viewing Balances

- Dashboard shows who owes what
- Green balance = you are owed money
- Red balance = you owe money
- See detailed breakdown in the Balances sidebar

## Deployment

To deploy on Vercel:

1. Push this code to GitHub
2. Import the project in Vercel
3. It will automatically detect Vite and deploy!

## Technology Stack

- **Frontend**: React + Vite
- **Styling**: Custom CSS with modern design system
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Support

For issues or questions, please check the Firebase Console for any configuration errors.
