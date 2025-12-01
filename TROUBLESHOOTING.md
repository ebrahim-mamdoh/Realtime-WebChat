# Troubleshooting Guide

Common issues and their solutions for the Real-Time Chat application.

## 🔥 Firebase Issues

### "Firebase: Error (auth/configuration-not-found)"

**Cause**: Firebase not configured or environment variables missing

**Solution**:
1. Check `.env.local` exists in project root
2. Verify all variables are set:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
3. Restart dev server: `npm run dev`

---

### "Firebase: Error (auth/operation-not-allowed)"

**Cause**: Email/Password or Anonymous auth not enabled

**Solution**:
1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password"
4. Enable "Anonymous"
5. Save and try again

---

### "Firebase: Error (auth/weak-password)"

**Cause**: Password less than 6 characters

**Solution**: Use a password with at least 6 characters

---

### "Firebase: Error (auth/email-already-in-use)"

**Cause**: Email already registered

**Solution**: 
- Use different email, or
- Login with existing account

---

### "Firebase: Error (auth/invalid-email)"

**Cause**: Email format is invalid

**Solution**: Use valid email format (user@example.com)

---

## 💬 Messaging Issues

### Messages Not Sending

**Cause 1**: Firestore rules not deployed

**Solution**:
1. Go to Firebase Console → Firestore → Rules
2. Copy content from `firestore.rules`
3. Paste and publish

**Cause 2**: User not authenticated

**Solution**: Ensure user is logged in

**Cause 3**: Network error

**Solution**: Check internet connection

---

### Messages Not Appearing in Real-Time

**Cause**: Firestore rules blocking reads

**Solution**:
1. Verify rules are deployed correctly
2. Check browser console for permission errors
3. Ensure user is participant in conversation

---

### "Permission Denied" in Console

**Cause**: Security rules blocking operation

**Solution**:
1. Check Firestore rules match `firestore.rules` file
2. Verify user is authenticated
3. Ensure user is participant in conversation
4. Redeploy rules if needed

---

## 🖼️ Image Upload Issues

### "Failed to upload image"

**Cause 1**: Storage rules not deployed

**Solution**:
1. Go to Firebase Console → Storage → Rules
2. Copy content from `storage.rules`
3. Paste and publish

**Cause 2**: Image too large (>5MB)

**Solution**: Use image under 5MB

**Cause 3**: File is not an image

**Solution**: Select image file (JPEG, PNG, GIF, WebP)

---

### Images Not Loading

**Cause**: Storage rules blocking reads

**Solution**:
1. Verify storage rules deployed
2. Check image URL is valid
3. Ensure user is authenticated

---

## 🔧 Build & Development Issues

### "Module not found" Error

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

---

### "Cannot find module" After Adding File

**Cause**: TypeScript compilation issue

**Solution**:
1. Restart dev server
2. Clear `.next` folder:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Build Fails with Type Errors

**Cause**: TypeScript type mismatches

**Solution**:
1. Check error message for specific file
2. Fix type issues in that file
3. Run `npx tsc --noEmit` to check types

---

### Port 3000 Already in Use

**Cause**: Another process using port 3000

**Solution**:

**Option 1 - Use different port**:
```bash
PORT=3001 npm run dev
```

**Option 2 - Kill process (Mac/Linux)**:
```bash
lsof -ti:3000 | xargs kill
```

**Option 3 - Kill process (Windows)**:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Hot Reload Not Working

**Cause**: File watcher issues

**Solution**:
1. Restart dev server
2. Check file permissions
3. Try different editor

---

## 🌐 Deployment Issues

### Build Succeeds Locally but Fails on Vercel

**Cause**: Environment variables not set

**Solution**:
1. Go to Vercel Dashboard → Project → Settings
2. Add all environment variables
3. Redeploy

---

### App Works Locally but Not in Production

**Cause**: Environment variables

**Solution**:
1. Verify all `NEXT_PUBLIC_*` variables are set in Vercel
2. Check Firebase project allows your domain
3. Redeploy after adding variables

---

### Images Not Loading in Production

**Cause**: Domain not in Next.js image config

**Solution**:

Already configured in `next.config.js`:
```js
images: {
  domains: ['firebasestorage.googleapis.com'],
}
```

If issue persists, redeploy.

---

## 👤 User & Presence Issues

### Online Status Not Updating

**Cause**: Last seen not being updated

**Solution**:
1. Check browser console for errors
2. Verify Firestore rules allow writing to `users/{uid}`
3. Ensure internet connection is stable

---

### User Not Appearing in User List

**Cause**: User document not created

**Solution**:
1. Logout and login again
2. Check Firebase Console → Firestore → users collection
3. Manually create document if needed

---

### "Guest" Users Can't Chat

**Cause**: Anonymous auth not enabled

**Solution**:
1. Enable Anonymous auth in Firebase Console
2. Try anonymous login again

---

## ⌨️ Typing Indicator Issues

### Typing Indicator Not Showing

**Cause**: Firestore rules or listener issue

**Solution**:
1. Check `typing` subcollection rules
2. Verify both users are in conversation
3. Check browser console for errors

---

### Typing Indicator Stuck

**Cause**: Not clearing on stop

**Solution**:
- Close and reopen chat
- Indicator should clear after 2 seconds

---

## 🔒 Security & Permissions

### "Missing or insufficient permissions"

**Cause**: Security rules denying access

**Solution**:
1. Verify rules in Firebase Console match local files
2. Check user is authenticated
3. Ensure operation is allowed by rules
4. Redeploy rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

---

### Can See Other Users' Messages

**Cause**: Should not happen with correct rules

**Solution**:
1. **URGENT**: Check Firestore rules immediately
2. Ensure rules deployed from `firestore.rules`
3. Test in different conversation

---

## 📱 Browser Issues

### App Not Loading

**Cause**: Browser cache or compatibility

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Try incognito/private mode
4. Try different browser

---

### Styles Not Appearing

**Cause**: CSS not loading

**Solution**:
1. Check `globals.css` imported in `_app.tsx`
2. Clear `.next` folder and rebuild
3. Hard refresh browser

---

### WebSocket Errors

**Cause**: Firestore connection issues

**Solution**:
1. Check internet connection
2. Check Firebase Console for outages
3. Try disabling browser extensions
4. Check firewall/proxy settings

---

## 🐛 General Debugging

### Check Browser Console

**Chrome/Firefox/Safari**:
1. Press `F12` or `Right-click → Inspect`
2. Click "Console" tab
3. Look for red errors

Common errors and fixes:
- "Failed to fetch" → Network issue
- "Permission denied" → Security rules
- "Not found" → Path or ID issue

---

### Check Firebase Console

**Authentication**:
- Users → Verify user exists
- Sign-in methods → Verify methods enabled

**Firestore**:
- Data → Check collections exist
- Rules → Verify rules published
- Usage → Check quotas

**Storage**:
- Files → Check uploads appear
- Rules → Verify rules published

---

### Enable Debug Mode

Add to `lib/firebase.ts`:
```typescript
import { getFirestore, enableIndexedDbPersistence, setLogLevel } from 'firebase/firestore';

// Enable debug logging
setLogLevel('debug');
```

---

### Check Network Tab

1. Open DevTools → Network tab
2. Reload page
3. Look for failed requests (red)
4. Check status codes:
   - 401 → Authentication issue
   - 403 → Permission denied
   - 404 → Not found
   - 500 → Server error

---

## 📊 Performance Issues

### App Slow to Load

**Solution**:
1. Check internet connection
2. Optimize images (compress before upload)
3. Clear browser cache
4. Check Firebase usage/quotas

---

### Messages Delayed

**Solution**:
1. Check network latency
2. Verify Firestore not throttled
3. Check Firebase Console → Usage
4. Consider upgrading Firebase plan

---

## 💰 Cost/Quota Issues

### "Quota exceeded"

**Cause**: Free tier limits reached

**Solution**:
1. Check Firebase Console → Usage tab
2. Wait for quota reset (daily)
3. Upgrade to Blaze plan for production

**Free Tier Limits**:
- Firestore: 50K reads, 20K writes/day
- Storage: 1GB
- Bandwidth: 10GB/month

---

### Unexpected Firebase Costs

**Solution**:
1. Check Firebase Console → Usage
2. Look for spike in operations
3. Set up budget alerts
4. Optimize queries to reduce reads

---

## 🔍 Diagnostic Commands

### Check Node/npm Version
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

### Check Dependencies
```bash
npm list
```

### Verify Environment Variables
```bash
cat .env.local  # Mac/Linux
type .env.local # Windows
```

### Check Build
```bash
npm run build
```

### Check TypeScript
```bash
npx tsc --noEmit
```

### Check Lint
```bash
npm run lint
```

---

## 🆘 Still Stuck?

### Checklist
- [ ] `.env.local` exists with all variables
- [ ] Firebase auth methods enabled
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser console checked
- [ ] Firebase Console checked

### Reset Everything
```bash
# Stop dev server
# Delete generated files
rm -rf .next node_modules package-lock.json

# Fresh install
npm install

# Restart
npm run dev
```

### Get Help
1. Check documentation files
2. Review error messages carefully
3. Search Firebase documentation
4. Check Next.js documentation
5. Review code in similar files

---

## 📝 Logging Issues

To help debug, add logging:

```typescript
// In any file
console.log('Debug info:', variableName);
console.error('Error:', error);
```

Check browser console for output.

---

## ✅ Prevention Tips

### Before Starting Development
- [ ] Verify all setup steps completed
- [ ] Test with one message before building features
- [ ] Keep dev server running
- [ ] Watch for console errors

### During Development
- [ ] Commit working code frequently
- [ ] Test changes immediately
- [ ] Check console after each change
- [ ] Keep Firebase Console open

### Before Deployment
- [ ] Test all features locally
- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Verify environment variables

---

**Most issues are due to:**
1. Missing environment variables (40%)
2. Firestore rules not deployed (30%)
3. Authentication not enabled (20%)
4. Other (10%)

**Always check these first!**

---

**Need more help? Review the documentation files!** 📚
