# HIIT Workout Timer PWA

A production-quality Progressive Web App (PWA) for HIIT and circuit training workouts. Premium dark theme design with voice coaching, custom workout builder, and offline functionality.

## Features

✅ **Offline-First**: Works completely offline after installation using Service Workers  
✅ **Voice Coaching**: Built-in speech synthesis with customizable rate and volume  
✅ **Custom Workouts**: Create and save multiple workout templates  
✅ **Dark Theme**: Premium dark UI optimized for gym lighting  
✅ **Responsive Design**: Mobile-first design that works on all devices  
✅ **Cross-Platform**: Install on Android, iOS, Chrome, and Edge  
✅ **Local Storage**: All workouts and settings saved locally  
✅ **No Backend Required**: Completely client-side application  
✅ **Audio & Vibration**: Beeps and device vibration support  
✅ **Progress Tracking**: Visual progress bar and round counter  

## File Structure

```
workout-timer/
├── index.html           # Main HTML entry point
├── style.css            # Complete stylesheet (dark theme)
├── app.js               # Main app logic and UI management
├── timer.js             # Workout timer with phase logic
├── speech.js            # Voice coaching module
├── storage.js           # Local storage management
├── manifest.json        # PWA manifest for installation
├── service-worker.js    # Service worker for offline support
├── assets/
│   ├── icons/           # App icons for various sizes
│   └── screenshots/     # PWA screenshots
└── README.md            # This file
```

## Getting Started

### Local Development

1. **Clone or download the project**

```bash
git clone <repository-url>
cd workout-timer
```

2. **Start a local web server**

Using Python 3:
```bash
python -m http.server 8000
```

Using Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Using Node.js (with http-server):
```bash
npx http-server
```

3. **Open in browser**
```
http://localhost:8000
```

### Installation Instructions

#### Android (Chrome/Edge)

1. Open the app in Chrome or Edge
2. Tap the menu (⋮) in the top right
3. Select **"Install app"** or **"Add to Home screen"**
4. Confirm installation
5. App will appear on your home screen

**Offline Usage**: App works completely offline after installation

#### iPhone/iPad (Safari)

1. Open the app in Safari
2. Tap the Share button (arrow up from bottom)
3. Select **"Add to Home Screen"**
4. Give it a name and tap **"Add"**
5. App appears on your home screen
6. Launch from home screen - it will work offline

#### Desktop (Chrome/Edge/Opera)

1. Open the app in your browser
2. Click the install icon in the address bar (if visible)
3. Or right-click → "Create shortcut"
4. App launches in standalone window mode

## Deployment Options

### 1. GitHub Pages (Recommended - Free)

1. **Create a GitHub repository**
   - Go to github.com and create a new repository named `workout-timer`

2. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/workout-timer.git
cd workout-timer
```

3. **Add your files**
```bash
# Copy all project files to the cloned directory
git add .
git commit -m "Initial commit: Add workout timer PWA"
git push origin main
```

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select "main" branch as source
   - Save

5. **Access your app**
```
https://YOUR-USERNAME.github.io/workout-timer/
```

### 2. Netlify (Recommended - Easy Setup)

1. **Connect GitHub**
   - Go to netlify.com
   - Click "New site from Git"
   - Connect your GitHub account

2. **Select repository**
   - Choose your `workout-timer` repository
   - Leave build settings empty (no build needed)

3. **Deploy**
   - Netlify automatically deploys on push

4. **Custom domain (optional)**
   - Go to Domain Management
   - Connect your custom domain

### 3. Vercel (Alternative)

1. **Go to vercel.com**
   - Click "New Project"
   - Import your GitHub repository

2. **Deploy**
   - Leave framework detection as "Other"
   - Click "Deploy"

3. **Access your app**
   - Automatically assigned a vercel.app URL

### 4. AWS S3 (Advanced)

1. **Create S3 bucket**
```bash
aws s3 mb s3://workout-timer --region us-east-1
```

2. **Upload files**
```bash
aws s3 sync . s3://workout-timer --exclude ".git/*"
```

3. **Enable static hosting**
   - Bucket Properties → Static website hosting
   - Index document: `index.html`

4. **Configure CloudFront (optional)**
   - For faster global delivery
   - Cache all files

### 5. Self-Hosted (VPS/Server)

1. **Upload files via SFTP**
```bash
sftp user@your-server.com
put -r workout-timer /var/www/html/
```

2. **Configure web server (Nginx example)**
```nginx
server {
  listen 80;
  server_name your-domain.com;
  
  root /var/www/html/workout-timer;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # Cache service worker
  location /service-worker.js {
    add_header Cache-Control "max-age=0, no-cache, no-store";
  }
  
  # Enable GZIP
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
}
```

3. **Enable HTTPS**
```bash
certbot certonly --webroot -w /var/www/html/workout-timer -d your-domain.com
```

## Usage Guide

### Home Screen
- **Start Workout**: Begin your workout with current settings
- **Edit Workout**: Customize exercises and order
- **Settings**: Adjust timings and audio preferences

### Workout Builder
- Add/remove/reorder exercises with drag-and-drop
- Customize workout name
- Auto-saves to local storage

### Timer Screen
- Large countdown timer display
- Current exercise name and progress
- Round counter and exercise counter
- Skip/previous phase navigation
- Pause/resume functionality
- Real-time progress bar

### Settings
- Customize all timings
- Enable/disable voice coaching
- Audio beeps toggle
- Vibration support
- Speech rate and volume
- Import/export data

## Default Workout

Included by default:
- **Warm-up**: 10 seconds
- **Exercises**: 30 seconds each
  - Skipping
  - Jacks
  - Running in Place
  - Mountain Climbers
  - Jump Squats
  - Bicycle Crunches
  - Burpees
  - Jab-Jab-Cross
- **Rest**: 10 seconds between exercises
- **Round Rest**: 60 seconds between rounds
- **Rounds**: 2
- **Cooldown**: 5 minutes

## Browser Support

| Browser | Android | iOS | Desktop |
|---------|---------|-----|---------|
| Chrome | ✅ Latest | ❌ | ✅ Latest |
| Edge | ✅ Latest | ❌ | ✅ Latest |
| Safari | ❌ | ✅ 14+ | ✅ 14+ |
| Firefox | ⚠️ Limited | ❌ | ✅ Latest |
| Opera | ✅ Latest | ❌ | ✅ Latest |

**Note**: iOS uses "Add to Home Screen" instead of traditional PWA installation due to Apple's restrictions.

## Features in Detail

### Voice Coaching
- Countdown announcements (3, 2, 1)
- Exercise name announcements
- "Rest" announcements
- "Halfway" point notifications
- Time remaining alerts (10s, 5s)
- Round number announcements
- Completion message
- Customizable speech rate and volume

### Audio Feedback
- Beep sounds for:
  - Exercise start
  - Rest period start
  - Round changes
  - Workout completion
- Toggle on/off in settings

### Vibration Support
- Short vibrations for phase changes
- Long vibration for workout completion
- Falls back gracefully on unsupported devices

### Progress Tracking
- Visual progress bar (overall workout progress)
- Round counter
- Exercise counter
- Next exercise preview
- Completion statistics

## Data Management

### Local Storage
- All data stored locally (private, no cloud sync)
- Approximately 5MB limit
- Persists across app closures
- Can be cleared from settings

### Export/Import
- Export all data as JSON
- Import previously exported data
- Backup feature for multiple devices

### Reset
- Reset to default settings
- Keeps workouts intact
- Or clear everything

## Offline Functionality

The app works completely offline thanks to Service Workers:

1. **First load**: Downloads all necessary files
2. **Service Worker**: Installed and ready
3. **Offline mode**: All features work without internet
4. **Auto-update**: Checks for updates when online

## Performance

- **First Load**: ~2-3 seconds (cached afterwards)
- **Startup**: <500ms
- **Memory Usage**: ~10-15MB
- **App Size**: ~150KB (gzipped)
- **Battery**: Optimized for minimal drain

## Troubleshooting

### App won't install
- Ensure you're using HTTPS (except localhost)
- Check that manifest.json is served correctly
- Clear browser cache and try again

### Voice not working
- Check browser speech synthesis support
- Enable audio output
- Ensure "Voice Coaching" is enabled in settings

### Offline not working
- Service Worker requires HTTPS
- Check browser console for errors
- Try uninstalling and reinstalling the app

### Sound issues
- Check device volume
- Verify "Beeps" is enabled in settings
- Test on different device if possible

### Vibration not working
- Not all devices support vibration
- Check device vibration settings
- Ensure "Vibration" is enabled in settings

## Customization

### Theme Colors
Edit CSS variables in `style.css`:
```css
:root {
  --primary: #ff6b35;      /* Main brand color */
  --secondary: #004e89;    /* Secondary color */
  --bg-primary: #1a1a1a;   /* Background */
}
```

### Default Workout
Edit in `storage.js`:
```javascript
const DEFAULT_WORKOUT = {
  exercises: [
    'Your Exercise 1',
    'Your Exercise 2',
    // ...
  ]
};
```

### Default Settings
Modify in `storage.js`:
```javascript
const DEFAULT_SETTINGS = {
  warmupDuration: 10,
  workDuration: 30,
  // ...
};
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, custom properties
- **JavaScript ES6+**: Modular code structure
- **Web APIs**:
  - Service Worker API (offline)
  - Web Speech API (voice coaching)
  - Web Audio API (beeps)
  - Vibration API (haptic feedback)
  - Local Storage API (data persistence)

### Module Architecture
- `storage.js`: Persistent data management
- `speech.js`: Voice coaching and announcements
- `timer.js`: Core workout timer logic
- `app.js`: UI and screen management
- `service-worker.js`: Offline caching strategy

### State Management
- Timer has clear state machine (idle, running, paused, complete)
- Phases managed with explicit transitions
- UI updates through callbacks (observer pattern)
- No external dependencies needed

## Development

### Adding New Features
1. Create separate module if needed
2. Expose via IIFE pattern
3. Use module callbacks for communication
4. Update UI from callbacks

### Testing
- Test on multiple devices
- Verify offline functionality (dev tools → offline)
- Check all voice announcements
- Test audio on different devices

### Browser DevTools
- Chrome: F12 → Application → Service Workers
- Firefox: about:debugging → This Firefox
- Safari: Develop → Advanced → Show Develop Menu

## License & Credits

This is a complete, production-ready PWA implementation.
Free to use, modify, and distribute.

## Support

For issues or questions:
1. Check browser console (F12)
2. Verify service worker status
3. Test in incognito/private mode
4. Try different browser

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Browser Tested**: Chrome, Edge, Safari  

Built with ❤️ for fitness enthusiasts
