# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Firebase Setup

### Create Firebase Project
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Follow the wizard

### Enable Services
1. **Authentication**: Enable Email/Password + Anonymous
2. **Firestore**: Create database in test mode
3. **Storage**: Enable storage

### Get Config
1. Project Settings → Your apps → Add web app
2. Copy configuration values

## 3. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials.

## 4. Deploy Security Rules

### Option A: Firebase Console
- Copy `firestore.rules` → Firestore Rules
- Copy `storage.rules` → Storage Rules

### Option B: Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,storage:rules
```

## 5. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## 6. Test the App

### Create First User
1. Go to signup page
2. Create account
3. Login

### Create Second User
1. Open incognito window
2. Create another account
3. Login

### Start Chatting
1. In either account, click "Users" tab
2. Select the other user
3. Start chatting!

## Common Issues

**Firebase not initialized?**
- Check `.env.local` has all variables
- Restart dev server after adding env vars

**Can't send messages?**
- Deploy Firestore security rules
- Check Firebase Console for errors

**Images not uploading?**
- Deploy Storage security rules
- Check image is under 5MB

## Next Steps

- Customize colors in `tailwind.config.js`
- Deploy to Vercel: `vercel`
- Add more features!

Enjoy! 🚀
