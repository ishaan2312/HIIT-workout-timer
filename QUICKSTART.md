# Quick Start Guide - Workout Timer PWA

Get your workout timer running in just a few steps.

## 5-Minute Setup

### 1. Start a Local Server (Pick One)

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js:**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

### 2. Open Your Browser

Visit: `http://localhost:8000`

### 3. Try It Out

- Click "Start Workout" to begin
- Use the default HIIT workout
- Pause/Resume the timer
- Customize exercises in "Edit Workout"

**Done!** The app is now running locally.

---

## Installation on Device

### Android (Chrome)

1. Open app in Chrome
2. Tap **⋮** (menu) top right
3. Tap **"Install app"**
4. Confirm

✅ App now on home screen and works offline

### iPhone/iPad (Safari)

1. Open app in Safari
2. Tap **Share** (arrow up from bottom)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**

✅ App now on home screen and works offline

### Desktop (Chrome/Edge/Opera)

1. Look for **install icon** in address bar
2. Or right-click → **"Create shortcut"**
3. Check **"Open as window"**

✅ App opens in its own window

---

## First Workout

1. **Home Screen** → Click **"Start Workout"**
2. **Timer Screen** → Click **"Start"**
3. **Warm up** for 10 seconds
4. **Exercise** for 30 seconds each
5. **Rest** for 10 seconds between
6. **Round 2** after 60 seconds
7. **Cooldown** for 5 minutes
8. **Complete!** 🎉

Total time: ~8 minutes

---

## Create Custom Workout

1. Click **"Edit Workout"**
2. Click **"+ Add Exercise"** or modify existing
3. Reorder exercises by dragging
4. Click **"Save Workout"**
5. Back on home screen → **"Start Workout"**

---

## Customize Settings

1. Click **"⚙ Settings"**
2. Adjust timings:
   - Warm-up duration
   - Work duration
   - Rest duration
   - Round rest
   - Cooldown duration
   - Number of rounds
3. Toggle audio features:
   - Voice Coaching
   - Beeps
   - Vibration
4. Adjust speech rate/volume (if supported)

Changes apply immediately!

---

## Keyboard Shortcuts (Desktop)

| Key | Action |
|-----|--------|
| `Space` | Start/Pause |
| `→` | Skip phase |
| `←` | Previous phase |
| `R` | Restart |
| `Esc` | Home screen |

(Implementation note: Add these as enhancements)

---

## Offline Mode

App works 100% offline after installation:

1. Install app on home screen
2. Close and reopen
3. Toggle internet off
4. App still works!

All your workouts and settings stay on your device.

---

## Tips & Tricks

### Maximize Battery Life
- Disable voice if not needed
- Use landscape mode on phones
- Lower screen brightness

### Better Workout Experience
- Use earbuds for announcements
- Enable vibration for cues
- Use full-screen mode

### Data Management
- **Export:** Settings → "Export Data" (creates backup)
- **Import:** Load previously exported file
- **Reset:** Clear all and start fresh

### Voice Coaching
- **Available in:** Most modern browsers
- **Fallback:** Beeps if speech unavailable
- **Customize:** Adjust rate and volume in settings

---

## Troubleshooting

### App won't start
```
Solution: Refresh page (Ctrl+R or Cmd+R)
```

### Timer doesn't count down
```
Solution: 
1. Click "Start" button
2. Check browser console (F12)
3. Reload if needed
```

### Voice not working
```
Solution:
1. Check device volume
2. Ensure voice is enabled in settings
3. Test on different browser
4. Some browsers don't support speech synthesis
```

### Offline not working
```
Solution:
1. App requires HTTPS (except localhost)
2. Uninstall and reinstall
3. Clear browser cache
4. Try different browser
```

### Can't install
```
Solution:
1. Use recent browser version
2. App must be on HTTPS
3. Try desktop first, then phone
4. Clear browser data and retry
```

---

## File Overview

| File | Purpose |
|------|---------|
| `index.html` | Main page |
| `style.css` | All styling (dark theme) |
| `app.js` | UI logic and screens |
| `timer.js` | Workout timer logic |
| `speech.js` | Voice coaching |
| `storage.js` | Save/load workouts |
| `manifest.json` | PWA settings |
| `service-worker.js` | Offline support |

---

## Deployment (Choose One)

### Free: GitHub Pages

```bash
git init
git add .
git commit -m "Workout Timer PWA"
git push origin main

# Enable Pages in repo settings
# Your app: https://username.github.io/workout-timer
```

### Free: Netlify

```bash
# Option 1: Drag & drop folder to netlify.com
# Option 2: Connect GitHub repo
# Auto-deploys on push
```

### Free: Vercel

```bash
npm i -g vercel
vercel
# Follows prompts, auto-deployed
```

See README.md for detailed deployment instructions.

---

## Next Steps

1. ✅ Run locally
2. ✅ Install on device
3. ✅ Create custom workout
4. ✅ Adjust settings
5. ✅ Deploy to web
6. ✅ Share with friends

---

## Questions?

📖 Full guide: `README.md`  
🔧 Setup details: `SETUP.md`  
📋 Before deploy: `DEPLOYMENT_CHECKLIST.md`

**Enjoy your workouts!** 💪

---

**Version:** 1.0  
**Updated:** 2024  
**Status:** Production Ready
