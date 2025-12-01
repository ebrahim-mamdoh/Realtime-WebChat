# Scripts Guide

This document explains all npm scripts available in this project.

## 🚀 Development Scripts

### `npm run dev`
**Start the development server**

```bash
npm run dev
```

- Starts Next.js in development mode
- Opens on http://localhost:3000
- Hot module replacement enabled
- Fast refresh for React components
- Source maps for debugging
- Development-only warnings shown

**When to use**: Daily development, testing features

---

### `npm run build`
**Build the application for production**

```bash
npm run build
```

- Compiles TypeScript to JavaScript
- Optimizes code for production
- Generates static pages where possible
- Minimizes bundle size
- Creates `.next` folder with build output
- Shows build statistics

**When to use**: Before deployment, testing production build

---

### `npm start`
**Start the production server**

```bash
npm start
```

- Requires `npm run build` first
- Runs optimized production build
- No hot reloading
- Better performance than dev mode
- Opens on http://localhost:3000

**When to use**: Testing production build locally

---

### `npm run lint`
**Run ESLint to check code quality**

```bash
npm run lint
```

- Checks all TypeScript/JavaScript files
- Reports code quality issues
- Suggests fixes
- Enforces consistent code style
- Catches common errors

**When to use**: Before committing code, during development

---

## 🔧 Custom Scripts You Can Add

### Add Type Checking

Add to `package.json`:
```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

Run: `npm run type-check`

---

### Add Format Script

Install Prettier:
```bash
npm install -D prettier
```

Add to `package.json`:
```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

Run: `npm run format`

---

### Add Clean Script

Add to `package.json`:
```json
{
  "scripts": {
    "clean": "rm -rf .next node_modules",
    "fresh-install": "npm run clean && npm install"
  }
}
```

Run: `npm run clean`

---

### Add Firebase Deploy

With Firebase CLI installed:
```json
{
  "scripts": {
    "deploy:rules": "firebase deploy --only firestore:rules,storage:rules",
    "deploy:hosting": "npm run build && firebase deploy --only hosting"
  }
}
```

Run: `npm run deploy:rules`

---

### Add Export Script

For static export:
```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

Run: `npm run export`

---

## 📦 Dependency Management

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Audit Security
```bash
npm audit
npm audit fix
```

---

## 🔄 Workflow Examples

### Normal Development
```bash
npm install          # First time only
npm run dev         # Start development
# Make changes, test
npm run lint        # Check code quality
```

### Prepare for Deployment
```bash
npm run lint        # Check for issues
npm run build       # Test build
npm start          # Test production locally
# Deploy to Vercel/Netlify
```

### After Pulling Changes
```bash
npm install         # Install new dependencies
npm run dev        # Resume development
```

### Clean Slate
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 🐛 Troubleshooting Scripts

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Dependency Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### Type Errors
```bash
# Check types without building
npx tsc --noEmit
```

---

## 📊 Script Output Examples

### Successful Build
```
info  - Linting and checking validity of types
info  - Creating an optimized production build
info  - Compiled successfully
info  - Collecting page data
info  - Generating static pages (5/5)
info  - Finalizing page optimization

Route (pages)                              Size     First Load JS
┌ ○ /                                     2.5 kB          85 kB
├ ○ /404                                  194 B          82.6 kB
├ ○ /auth/login                           1.2 kB          83.8 kB
├ ○ /auth/signup                          1.3 kB          83.9 kB
└ ○ /chat/[conversationId]               1.8 kB          84.4 kB
```

### Lint Warnings
```
./components/ChatWindow.tsx
45:7  Warning: React Hook useEffect has a missing dependency  react-hooks/exhaustive-deps

✖ 1 problem (0 errors, 1 warning)
```

---

## 💡 Pro Tips

### Faster Development
- Use `npm run dev` with file watching
- Keep terminal open to see errors instantly
- Use browser DevTools for debugging

### Better Code Quality
- Run `npm run lint` before committing
- Fix warnings, not just errors
- Use TypeScript types properly

### Production Builds
- Always test `npm run build` before deploying
- Check build output for large bundles
- Ensure no build warnings

### Environment Variables
- Restart dev server after changing `.env.local`
- Use `NEXT_PUBLIC_` prefix for client-side vars
- Never commit `.env.local`

---

## 🎯 Quick Reference

| Command | Purpose | When |
|---------|---------|------|
| `npm install` | Install dependencies | First setup, after pulling |
| `npm run dev` | Start development | Daily development |
| `npm run build` | Production build | Before deployment |
| `npm start` | Run production | Testing prod locally |
| `npm run lint` | Check code quality | Before committing |

---

## 📝 Adding Your Own Scripts

Edit `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    
    // Add your custom scripts here
    "custom-script": "your command here"
  }
}
```

Then run: `npm run custom-script`

---

**Happy Scripting! 🚀**
