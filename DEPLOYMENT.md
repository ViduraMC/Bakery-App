# 🚀 Deployment Guide: Sweet Delights Bakery App

This guide walks you through deploying your full-stack application to the internet.

- **Backend**: Render (Free Tier)
- **Frontend**: Vercel (Free Tier)

---

## ✅ Prerequisites

1. **GitHub Repository**: Your code is already pushed to GitHub.
2. **Render Account**: [Sign up here](https://render.com/)
3. **Vercel Account**: [Sign up here](https://vercel.com/)

---

## 🛠️ Part 1: Deploy Backend (Render)

1. **Log in to Render** and click **"New +"** → **"Web Service"**.
2. **Connect GitHub**: Select your `Bakery-App` repository.
3. **Configure Settings**:
   - **Name**: `bakery-server` (or similar)
   - **Region**: Closest to you (e.g., Singapore, Frankfurt)
   - **Branch**: `master`
   - **Root Directory**: `server` (⚠️ Important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. **Environment Variables** (Optional but recommended):
   - Key: `NODE_VERSION`
   - Value: `18`

5. **Click "Create Web Service"**.
   - Wait for the deployment to finish. It might take a few minutes.
   - Once live, copy the **Service URL** from the top left (e.g., `https://bakery-server-xyz.onrender.com`).

> **⚠️ Note on Database**: Since we are using SQLite on the free tier, the database is **ephemeral**. This means every time the server restarts (or sleeps after inactivity), the data resets. I have updated the code to automatically re-create the `admin` and `user` accounts on every start, so you can always log in.

---

## 🌐 Part 2: Deploy Frontend (Vercel)

1. **Log in to Vercel** and click **"Add New..."** → **"Project"**.
2. **Import Git Repository**: Select your `Bakery-App` repository.
3. **Configure Project**:
   - **Framework Preset**: `Next.js` (Should be auto-detected)
   - **Root Directory**: Click "Edit" and select `client` (⚠️ Important!)

4. **Environment Variables**:
   - Expand the "Environment Variables" section.
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://bakery-server-xyz.onrender.com/api`
     *(Replace with your actual Render URL from Part 1. Make sure to add `/api` at the end!)*

5. **Click "Deploy"**.
   - Wait for the build to complete.
   - Once done, you will get a domain (e.g., `bakery-app.vercel.app`).

---

## 🎉 Part 3: Final Verification

1. Open your **Vercel URL**.
2. Go to the **Login Page**.
3. Use the demo credentials:
   - **Admin**: `admin` / `12345`
   - **User**: `user` / `12345`
4. Verify you can see products and place orders.

**Congratulations! Your Enterprise-Grade Bakery App is now live! 🌍**
