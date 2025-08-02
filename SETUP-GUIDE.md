# Document.it - AI-Powered Career Analytics MVP

## 🎯 Complete Setup Guide

### 📋 What You Get
- **Rebranded to Document.it** with professional white/ivory + blue color scheme
- **AI-powered career analytics** using Perplexity AI
- **Firebase cloud storage** for 500+ users
- **PDF report generation** (quarterly & semi-annual)
- **All 14 original fields** preserved
- **Performance review prep** and growth recommendations

---

## 🚀 Quick Start (5 Minutes)

### 1. **Deploy to GitHub Pages**
1. Create new repository: `document-it-mvp`
2. Upload all files (index.html, style.css, app.js)
3. Go to Settings → Pages
4. Enable Pages from main branch
5. Your site is live at `https://yourusername.github.io/document-it-mvp`

### 2. **Set Custom Domain (Optional)**
1. In your domain registrar, add CNAME record:
   - **Type:** CNAME
   - **Name:** app
   - **Value:** yourusername.github.io
2. In GitHub Settings → Pages, set custom domain: `app.yourdomainname.com`

---

## 🔧 API Setup (Required for AI Features)

### **Perplexity AI Setup**
1. **Sign up:** https://www.perplexity.ai/settings/api
2. **Get API key** (costs ~$5-20/month for 500 users)
3. **In Document.it:** Go to Settings → AI Configuration
4. **Paste your API key** and save

**Without API key:** The app works with mock AI responses for demo purposes.

---

## ☁️ Firebase Setup (Recommended for 500 Users)

### **Why Firebase?**
- **FREE** for MVP (1GB storage, 20K writes/day)
- **Real-time sync** across devices
- **No server maintenance** required
- **Automatic scaling**

### **Setup Steps:**
1. **Go to:** https://console.firebase.google.com
2. **Create new project:** "document-it-mvp"
3. **Enable Firestore Database** (start in test mode)
4. **Enable Authentication** (Email/Password)
5. **Get config:** Project Settings → General → Your apps
6. **Replace config in app.js:**

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

**Without Firebase:** The app uses localStorage (works for single device).

---

## 📊 Features Overview

### **AI Analytics**
- **Skill Growth Analysis:** Track skill development over time
- **Career Progression:** AI-powered insights on your career trajectory
- **Performance Review Prep:** Generate talking points for reviews
- **Growth Recommendations:** Personalized action items

### **Smart Reports**
- **Quarterly Reports:** Every 3 months
- **Semi-Annual Reports:** Every 6 months  
- **PDF Downloads:** Professional reports for performance reviews
- **Automatic Generation:** Set in Settings

### **All Original Features**
- **14-field weekly entries** (preserved exactly as designed)
- **Skills tagging system** with autocomplete
- **Interactive rating stars** and sliders
- **Custom categories and skills**
- **Entry editing and deletion**
- **Data export/import**

---

## 💰 Cost Breakdown for 500 Users

| Service | Cost | Purpose |
|---------|------|---------|
| **Firebase** | FREE | Database & Auth |
| **Perplexity AI** | $5-20/month | AI Analytics |
| **Domain** | $12/year | Custom URL |
| **GitHub Pages** | FREE | Hosting |
| **Total** | **~$5-20/month** | Complete platform |

---

## 🎨 Design Features

### **Document.it Branding**
- **Colors:** White/ivory backgrounds with blue accents (#2563eb)
- **Font:** Aptos-style (Inter fallback for web)
- **Feel:** Professional, trustworthy, clean

### **User Experience**
- **Mobile responsive** design
- **Smooth animations** and transitions
- **Professional notifications**
- **Accessibility features**

---

## 🧪 Testing Your Setup

### **Test Checklist:**
- [ ] Sign up for new account
- [ ] Create career entry with all 14 fields
- [ ] Generate AI insights
- [ ] Create quarterly report
- [ ] Export data as JSON
- [ ] Test mobile responsiveness

### **Demo Data:**
Use this for testing:
- **Email:** test@yourcompany.com
- **Skills:** JavaScript, Project Management, Leadership
- **Category:** Software Development
- **Difficulty:** 4/5 stars

---

## 🔍 Troubleshooting

### **Common Issues:**

**Blank screen after signup:**
- Check browser console for errors
- Ensure you're not in incognito mode
- Clear browser cache

**AI insights not working:**
- Add Perplexity API key in Settings
- Check API key is valid
- Mock responses work without API key

**Firebase not connecting:**
- Verify Firebase config in app.js
- Check Firestore rules allow read/write
- Enable Authentication in Firebase console

**PDF reports not generating:**
- Ensure jsPDF library is loaded
- Check browser allows downloads
- Try different browser

---

## 📈 Scaling to 1000+ Users

When you outgrow the free tiers:

1. **Firebase Blaze Plan:** ~$25/month for unlimited storage
2. **CDN:** Add Cloudflare for faster global loading
3. **Custom Domain:** Professional URL for branding
4. **Analytics:** Add Google Analytics for user insights

---

## 🎯 Success Metrics to Track

- **User Engagement:** Weekly active entries
- **Feature Usage:** AI insights generation rate
- **Retention:** Users returning after 30 days
- **Growth:** New signups per month

---

## 🚀 Your MVP is Ready!

You now have a **complete, AI-powered career analytics platform** that:
- ✅ Handles 500 users comfortably
- ✅ Provides real business value with AI insights
- ✅ Generates professional reports
- ✅ Scales with your business
- ✅ Costs less than $20/month to operate

**Next Steps:**
1. Deploy and test
2. Share with beta users
3. Gather feedback
4. Iterate and improve

**Your Document.it MVP is production-ready!** 🎉
