# 🚀 Deployment Guide - Spanish Learning App

This guide will help you deploy your Spanish Learning App to **Netlify (Frontend)** and **Render (Backend)**.

## 📋 Prerequisites

Before deploying, you need:

1. ✅ GitHub account (you have this!)
2. ✅ OpenAI API key - Get one at: https://platform.openai.com/api-keys
3. ✅ Netlify account - Sign up at: https://netlify.com (free)
4. ✅ Render account - Sign up at: https://render.com (free)

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started" and sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Spanish-App-Story`
3. Configure the service:
   - **Name**: `spanish-learning-api` (or any name you like)
   - **Region**: Oregon (or closest to you)
   - **Branch**: `claude/spanish-learning-app-Ss2xI`
   - **Root Directory**: Leave empty (render.yaml will handle it)
   - **Environment**: Node
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
In the Environment section, add:

```
Key: OPENAI_API_KEY
Value: sk-proj-your-actual-api-key-here

Key: NODE_ENV
Value: production

Key: PORT
Value: 3001
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (takes 5-10 minutes)
3. Once done, copy your backend URL (looks like: `https://spanish-learning-api.onrender.com`)

**Important**: Keep this URL handy! You'll need it for Netlify.

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Import Project
1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository: `Spanish-App-Story`
4. Choose branch: `claude/spanish-learning-app-Ss2xI`

### Step 3: Configure Build Settings
Netlify will auto-detect settings from `netlify.toml`, but verify:

- **Base directory**: `client`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `client/dist`

### Step 4: Add Environment Variable
**CRITICAL STEP** - Add your backend URL:

1. Before deploying, click "Show advanced"
2. Click "New variable"
3. Add:
   ```
   Key: VITE_API_URL
   Value: https://your-backend-url.onrender.com/api
   ```
   
   Replace `your-backend-url.onrender.com` with your actual Render URL from Part 1!

### Step 5: Deploy
1. Click "Deploy site"
2. Wait 2-3 minutes
3. Your site will be live at a URL like: `https://random-name-123.netlify.app`

### Step 6: Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Click "Add custom domain" to use your own domain
3. Or click "Change site name" to customize the Netlify subdomain

---

## ✅ Verify Deployment

### Test Your Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{"status":"ok"}
```

### Test Your Frontend
1. Visit your Netlify URL
2. You should see the Spanish Learning App home page
3. Try taking the Weekly Test
4. If it works, you're all set! 🎉

---

## 🐛 Troubleshooting

### Issue: "Network Error" or API calls fail

**Solution**: Check that `VITE_API_URL` in Netlify matches your Render backend URL exactly, including `/api` at the end.

1. Go to Netlify → Site settings → Environment variables
2. Verify `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
3. If you change it, click "Trigger deploy" to rebuild

### Issue: "Render backend is slow on first load"

**Expected Behavior**: Render's free tier "sleeps" after 15 minutes of inactivity. The first request takes 30-60 seconds to wake up. This is normal!

**Solution**: Upgrade to Render paid plan ($7/month) to keep it always awake, or just be patient on first load each day.

### Issue: Lessons or Stories not generating

**Solution**: Check your OpenAI API key:

1. Go to https://platform.openai.com/api-keys
2. Verify your key is active and has credits
3. Go to Render → Your service → Environment
4. Update `OPENAI_API_KEY` with the correct key
5. Service will automatically redeploy

### Issue: CORS errors in browser console

**Solution**: 
1. The code already handles CORS for `.netlify.app` domains
2. If using custom domain, you may need to update CORS settings in `server/src/index.ts`

---

## 💰 Cost Breakdown

### Free Tier (What You're Using)
- **Netlify**: Free (100GB bandwidth/month)
- **Render**: Free (750 hours/month, sleeps after 15 min)
- **OpenAI**: Pay-as-you-go (~$0.001 per lesson/story)

**Total**: ~$1-5/month for OpenAI depending on usage

### Upgrade Options
- **Render Pro**: $7/month (no sleep, better performance)
- **Netlify Pro**: $19/month (more bandwidth, analytics)

For personal use, free tier is plenty! 🎉

---

## 🔄 Updating Your App

When you make changes:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. Both Netlify and Render will **auto-deploy** from GitHub!

No manual redeployment needed - just push your code! ✨

---

## 📊 Monitoring

### Netlify
- View deploys: Site overview
- Check logs: Deploys → [Your deploy] → Deploy log

### Render
- View logs: Dashboard → Your service → Logs
- Monitor uptime: Dashboard → Your service → Metrics

---

## 🎉 You're Done!

Your Spanish Learning App is now live on the internet! Share your Netlify URL with friends and start learning Spanish together.

**Need help?** Check the logs in Netlify/Render or open an issue on GitHub.

¡Buena suerte! 🇪🇸
