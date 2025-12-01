# Installation Checklist

Use this checklist to set up your Real-Time Chat application.

## ☐ Pre-Installation

- [ ] Node.js 18+ installed
- [ ] npm or yarn available
- [ ] Code editor ready (VS Code recommended)
- [ ] Firebase account created
- [ ] Browser for testing (Chrome/Firefox/Safari)

## ☐ Firebase Project Setup

- [ ] Firebase Console opened (console.firebase.google.com)
- [ ] New project created (or existing selected)
- [ ] Project name chosen
- [ ] Google Analytics configured (optional)

### Authentication Setup
- [ ] Authentication enabled
- [ ] Email/Password sign-in method enabled
- [ ] Anonymous sign-in method enabled

### Firestore Setup
- [ ] Firestore Database created
- [ ] Started in test mode
- [ ] Location selected

### Storage Setup
- [ ] Firebase Storage enabled
- [ ] Started in test mode
- [ ] Same location as Firestore

### Web App Registration
- [ ] Web app registered in Firebase
- [ ] App nickname entered
- [ ] Firebase configuration copied

## ☐ Local Project Setup

- [ ] Project folder opened in terminal
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file created (copied from `.env.example`)
- [ ] All Firebase config values added to `.env.local`:
  - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
  - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] NEXT_PUBLIC_FIREBASE_APP_ID

## ☐ Security Rules Deployment

### Firestore Rules
- [ ] Firebase Console → Firestore → Rules tab opened
- [ ] `firestore.rules` file content copied
- [ ] Rules pasted in Firebase Console
- [ ] Rules published

### Storage Rules
- [ ] Firebase Console → Storage → Rules tab opened
- [ ] `storage.rules` file content copied
- [ ] Rules pasted in Firebase Console
- [ ] Rules published

## ☐ First Run

- [ ] Development server started (`npm run dev`)
- [ ] No errors in terminal
- [ ] http://localhost:3000 opened in browser
- [ ] Login page appears
- [ ] No console errors in browser

## ☐ Testing

### Account Creation
- [ ] Clicked "Sign up" link
- [ ] Entered display name
- [ ] Entered email
- [ ] Entered password (6+ characters)
- [ ] Clicked "Sign Up"
- [ ] Account created successfully
- [ ] Redirected to home page
- [ ] User appears in Firebase Console → Authentication

### Second User (Incognito/Private Window)
- [ ] Opened incognito/private window
- [ ] Navigated to http://localhost:3000
- [ ] Created second account
- [ ] Logged in successfully

### Starting Conversation
- [ ] Clicked "Users" tab
- [ ] Other user visible in list
- [ ] Clicked on other user
- [ ] Redirected to chat page
- [ ] Chat window opened

### Sending Messages
- [ ] Text message sent
- [ ] Message appears in sender's window
- [ ] Message appears in receiver's window (other browser)
- [ ] Timestamp visible
- [ ] Messages sync in real-time

### Image Upload
- [ ] Image button clicked
- [ ] Image file selected (<5MB)
- [ ] Image uploaded successfully
- [ ] Image appears in chat
- [ ] Image visible to both users

### Typing Indicator
- [ ] Started typing in one window
- [ ] "Typing..." appears in other window
- [ ] Indicator disappears after stopping

### Online Presence
- [ ] Green dot shows for online user
- [ ] "Online" status visible
- [ ] Status updates automatically

## ☐ Production Deployment (Optional)

### Pre-deployment
- [ ] All tests passing
- [ ] No errors in console
- [ ] Environment variables ready
- [ ] Build succeeds (`npm run build`)

### Vercel Deployment
- [ ] Vercel account created
- [ ] Project connected
- [ ] Environment variables added to Vercel
- [ ] Deployed successfully
- [ ] Production URL works
- [ ] Tested on production

### Post-deployment
- [ ] Created account on production
- [ ] Sent test message
- [ ] Uploaded test image
- [ ] Verified real-time updates work

## ☐ Optional Enhancements

- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Monitoring set up
- [ ] Backup strategy planned
- [ ] Custom branding applied
- [ ] Shared with friends!

## 📝 Notes

Use this section for your own notes during setup:

```
Firebase Project ID: _________________________

Production URL: _________________________

Issues encountered:
- _________________________
- _________________________

Fixes applied:
- _________________________
- _________________________
```

## ✅ Completion

When all checkboxes are checked, your chat app is ready to use!

**Estimated Setup Time**: 15-30 minutes

## 🆘 Troubleshooting

If you get stuck:

1. ☐ Check README.md troubleshooting section
2. ☐ Review QUICKSTART.md
3. ☐ Verify .env.local has all variables
4. ☐ Ensure Firebase rules are deployed
5. ☐ Check browser console for errors
6. ☐ Check terminal for build errors
7. ☐ Restart development server

## 📚 Next Steps After Setup

1. Read FEATURES.md to understand all capabilities
2. Review DEPLOYMENT.md for production deployment
3. Check CHANGELOG.md for future features
4. Customize colors in tailwind.config.js
5. Share with friends and start chatting!

---

**Happy Chatting! 🎉**
