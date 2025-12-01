# Deployment Guide

This guide covers deploying your chat application to various platforms.

## Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and offers the best integration.

### Method 1: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - Go to your project in Vercel Dashboard
   - Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Auto-Deploy**
   - Every push to `main` branch auto-deploys
   - Pull requests get preview deployments

## Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the App**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure**
   - Add environment variables in Netlify Dashboard
   - Set build command: `npm run build`
   - Set publish directory: `.next`

## Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**
   ```bash
   firebase login
   ```

3. **Initialize**
   ```bash
   firebase init hosting
   ```

4. **Configure `firebase.json`**
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Update `package.json`**
   ```json
   "scripts": {
     "build": "next build && next export"
   }
   ```

6. **Deploy**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Environment Variables

All platforms require these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Adding Variables

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**Netlify:**
- Dashboard → Site Settings → Build & Deploy → Environment

**Firebase Hosting:**
- Use `.env.local` (excluded from deployment via `.gitignore`)
- Build locally before deploying

## Pre-Deployment Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Anonymous)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Security rules deployed
- [ ] Environment variables configured
- [ ] App tested locally
- [ ] Build succeeds (`npm run build`)

## Post-Deployment

### Test Your Deployment

1. **Create Account**
   - Visit deployed URL
   - Sign up with email/password
   - Verify account created in Firebase Console

2. **Test Chat**
   - Create second account (incognito/private window)
   - Start conversation
   - Send text messages
   - Send image messages

3. **Test Real-Time Features**
   - Open chat in two browsers
   - Send message from one
   - Verify appears in other instantly
   - Check typing indicators work
   - Verify online status updates

### Monitor Usage

**Firebase Console:**
- Authentication → Users (view registered users)
- Firestore → Data (view conversations)
- Storage → Files (view uploaded images)
- Usage tab (monitor quotas)

**Vercel Analytics:**
- Dashboard → Analytics
- Monitor page views, performance

## Custom Domain

### Vercel

1. Dashboard → Project → Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. SSL certificate auto-provisioned

### Netlify

1. Dashboard → Domain Settings
2. Add custom domain
3. Update DNS records
4. HTTPS enabled automatically

## Performance Optimization

### Image Optimization

Already configured in `next.config.js`:
```js
images: {
  domains: ['firebasestorage.googleapis.com'],
}
```

### Caching

Vercel automatically caches static assets.

### CDN

Both Vercel and Netlify use global CDN for fast delivery.

## Scaling

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited sites
- Serverless function executions: 100GB-hours

**Firebase (Spark Plan):**
- 50,000 reads/day
- 20,000 writes/day
- 1GB storage
- 10GB/month bandwidth

### Upgrade Path

When you exceed free tier:

**Vercel:**
- Pro Plan: $20/month

**Firebase:**
- Blaze Plan (pay-as-you-go)
- Free tier included
- Pay only for overages

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names match exactly

### 404 Errors

- Ensure rewrites configured (Next.js automatic on Vercel)
- Check build output includes all pages

### Real-Time Not Working

- Verify environment variables are set
- Check Firebase security rules deployed
- Verify Firebase project accessible from deployed domain

## Continuous Deployment

### GitHub Actions (Vercel)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Considerations

1. **Never commit `.env.local`** (already in `.gitignore`)
2. **Use environment variables** for all secrets
3. **Deploy security rules** before going live
4. **Monitor Firebase usage** for anomalies
5. **Enable Firebase App Check** for production (optional)

## Backup Strategy

### Firestore Backup

```bash
# Using Firebase CLI
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)
```

### Automated Backups

- Set up Firebase Functions for scheduled backups
- Use Google Cloud Scheduler
- Export to Cloud Storage

## Monitoring

### Vercel

- Built-in analytics
- Real-time logs
- Performance metrics

### Firebase

- Console → Usage tab
- Set up budget alerts
- Monitor authentication errors

## Cost Estimation

### Typical Usage (100 active users)

**Firebase:**
- ~10,000 reads/day
- ~5,000 writes/day
- ~100MB storage
- Cost: Free (within Spark limits)

**Vercel:**
- ~1GB bandwidth/day
- Cost: Free (within limits)

### At Scale (10,000 users)

**Firebase:**
- Upgrade to Blaze plan
- Estimated: $25-50/month

**Vercel:**
- May need Pro plan
- Cost: $20/month

---

## Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Firebase
npm run build && firebase deploy
```

**Your app is ready to share with the world! 🚀**
