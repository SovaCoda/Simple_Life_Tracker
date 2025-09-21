# MTG Commander Life Tracker - PWA Installation Guide

## What is a PWA?
A Progressive Web App (PWA) is a web application that can be installed on your device like a native app. It provides:
- **Fullscreen experience** (no browser UI)
- **Offline functionality** 
- **Home screen icon**
- **App-like behavior**

## Installation Instructions

### On iPad/iPhone (Safari):
1. Open the app in Safari
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm
5. The app will appear on your home screen with a custom icon

### On Android (Chrome):
1. Open the app in Chrome
2. Tap the **menu** (three dots) in the top-right
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Add"** to confirm
5. The app will be installed and appear in your app drawer

### On Desktop (Chrome/Edge):
1. Open the app in Chrome or Edge
2. Look for the **install icon** in the address bar (usually a + or download icon)
3. Click **"Install"** when prompted
4. The app will be installed as a desktop application

## Benefits for iPad Mini 2 Users

Since iPad Mini 2 doesn't support fullscreen mode in Safari, installing as a PWA provides:
- ✅ **True fullscreen experience** (no Safari interface)
- ✅ **Better performance** (cached resources)
- ✅ **Offline access** (works without internet)
- ✅ **Native app feel** (launches from home screen)

## Features

- **Life Tracking**: Track life totals for up to 4 players
- **Commander Damage**: Track damage from each opponent
- **Poison Counters**: Track poison counters with visual indicators
- **Energy Counters**: Track energy counters with visual indicators
- **Custom Colors**: Assign unique colors to each player
- **Name Editing**: Customize player names
- **Dino Sounds**: Fun sound effects for the player named "Houston"
- **Offline Support**: Works without internet connection
- **Responsive Design**: Optimized for all screen sizes

## Technical Details

- **Service Worker**: Enables offline functionality and caching
- **Web App Manifest**: Defines app metadata and installation behavior
- **Responsive Icons**: Multiple icon sizes for different devices
- **Landscape Orientation**: Optimized for tablet use
- **Dark Theme**: Easy on the eyes during long gaming sessions

## Troubleshooting

### App won't install?
- Make sure you're using a supported browser (Safari, Chrome, Edge)
- Check that the site is served over HTTPS (required for PWA)
- Try refreshing the page and attempting installation again

### Offline mode not working?
- Make sure the Service Worker is registered (check browser console)
- Try clearing browser cache and reloading
- Ensure all files are properly cached

### Icons not showing?
- The app includes placeholder icons (SVG format)
- For better quality, convert the SVG to PNG using the included generator
- Open `icons/generate-icons.html` in a browser to create proper PNG icons

## Development

To improve the PWA:
1. Replace placeholder icons with proper PNG versions
2. Add more offline functionality
3. Implement push notifications for game events
4. Add more customization options

---

**Enjoy your MTG Commander games with this enhanced life tracker!**
