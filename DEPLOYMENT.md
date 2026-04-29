# Meal Planner App - Deployment Guide

## Overview
This is a React + Tailwind CSS web app for calculating TDEE, generating personalized meal plans, and exporting grocery lists. It's ready to deploy on Netlify.

## Features
✅ TDEE calculation using Mifflin-St Jeor formula  
✅ Macro distribution based on fitness goals  
✅ 7-day randomized meal plans  
✅ Swappable meals for each day  
✅ Grocery list aggregation  
✅ CSV export for shopping  
✅ Share plans via URL (encoded in browser)  
✅ Clean MacroFactor-style UI  

---

## Step-by-Step Deployment to Netlify

### Prerequisites
- Node.js installed on your computer
- A GitHub account
- A Netlify account (free tier is fine)

### Step 1: Push Code to GitHub

**1.1** Open your terminal and navigate to the project folder:
```bash
cd /Users/ian/Documents/Claude/Projects/meal plan agent
```

**1.2** Initialize a Git repository:
```bash
git init
git add .
git commit -m "Initial commit: meal planner app"
```

**1.3** Create a new repository on GitHub:
- Go to [github.com/new](https://github.com/new)
- Name it `meal-planner-app`
- **Do not** initialize with README
- Click "Create repository"

**1.4** Connect your local repo to GitHub (copy-paste the commands GitHub shows):
```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/meal-planner-app.git
git push -u origin main
```

---

### Step 2: Connect Netlify

**2.1** Go to [netlify.com](https://netlify.com) and log in (create free account if needed)

**2.2** Click **"Add new site"** → **"Import an existing project"**

**2.3** Choose **GitHub** and authorize Netlify to access your GitHub account

**2.4** Select your `meal-planner-app` repository

**2.5** Configure build settings:
- **Base directory:** (leave empty)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Click **Deploy**

**2.6** Wait for the build to complete (usually 1-2 minutes)

---

### Step 3: Access Your Live App

Once deployment completes:
- Netlify assigns a URL like `https://[random-name].netlify.app`
- Your app is now live! 🎉
- You can customize the domain in **Site settings** → **Domain management**

---

## Local Development

To test the app locally before deploying:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Troubleshooting

### Issue: Build fails with "module not found"
**Solution:** Run `npm install` locally to ensure all dependencies are installed.

### Issue: App shows blank page after deploying
**Solution:** Check the browser console (F12) for errors. Common issues:
- netlify.toml misconfigured
- dist folder not created properly
- Try redeploying by pushing a new commit to GitHub

### Issue: Share functionality doesn't work
**Solution:** Share links are stored in the URL as encoded data. They work on the deployed site only, not localhost.

---

## Project Structure

```
meal-planner-app/
├── src/
│   ├── App.jsx          # Main React component
│   ├── main.jsx         # React entry point
│   └── index.css        # Tailwind styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite build config
├── tailwind.config.js   # Tailwind config
├── netlify.toml         # Netlify config
└── README.md            # This file
```

---

## Customization

### Add more meals
Edit `src/App.jsx` and update the `mealDatabase` object with your own meal options.

### Change macro ratios
Find the `calculateMacros` function and adjust the `proteinRatio`, `carbRatio`, `fatRatio` for each goal.

### Update styling
Modify colors and spacing in `src/App.jsx` by changing Tailwind class names.

---

## Support

If you encounter issues:
1. Check the Netlify build logs: Site settings → Build & deploy → Builds
2. Check browser console for JavaScript errors (F12)
3. Verify all files were committed to GitHub

---

## License

This project is open source and free to use!
