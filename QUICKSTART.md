# Quick Start Guide

Get your Smart Life app up and running in 5 minutes!

## 🚀 Quick Setup (For Developers)

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Electron (v27.0.0)
- electron-builder (for creating macOS builds)
- electron-store (for persistent storage)

### 2. Run the App

```bash
npm start
```

The app will launch and you'll see the Smart Life interface.

## 🔧 First-Time Configuration

### Get Your Tuya API Credentials

1. **Create Tuya Account**
   - Visit: https://iot.tuya.com/
   - Sign up or log in

2. **Create Cloud Project**
   - Go to: Cloud > Development
   - Click: "Create Cloud Project"
   - Industry: Select "Smart Home"
   - Development Method: "Smart Home"
   - Data Center: Select your region (US/EU/CN/IN)

3. **Get API Keys**
   - Open your project
   - Go to: Overview tab
   - Copy your **Access ID/Client ID** (API Key)
   - Copy your **Access Secret/Client Secret** (API Secret)

4. **Link Devices**
   - Go to: Devices > Link Tuya App Account
   - Link your Smart Life mobile app account
   - This gives API access to your devices

5. **Enable APIs**
   - Go to: API tab
   - Enable these services:
     - ✓ IoT Core
     - ✓ Authorization
     - ✓ Smart Home Devices Management

### Configure the App

1. Launch Smart Life app
2. Click **⚙️ Settings** button
3. Enter your credentials:
   - **API Key**: Your Access ID
   - **API Secret**: Your Access Secret
   - **Endpoint**: Select your region
4. Click **Save Settings**

## 📱 Using the App

### View Devices
Your linked devices will appear on the main screen automatically.

### Control Devices
1. Click on any device card
2. Use the controls to:
   - Turn devices on/off
   - Adjust brightness (for lights)
   - Change temperature (for thermostats)
   - And more based on device type

### Refresh Device List
Click the **🔄 Refresh** button to reload your devices.

## 🏗️ Building for Distribution

### Create macOS Application

Build both DMG and ZIP:
```bash
npm run build
```

Build only DMG installer:
```bash
npm run build:dmg
```

The built files will be in the `dist/` folder:
- `Smart Life-1.0.0.dmg` - Installer
- `Smart Life-1.0.0-mac.zip` - Portable version

### Installing Your Build

1. Open the DMG file
2. Drag Smart Life to Applications
3. Launch from Applications folder

## 🐛 Troubleshooting

### "Cannot find module 'electron'"
```bash
rm -rf node_modules
npm install
```

### App doesn't start
- Check Node.js version: `node --version` (should be 16+)
- Check for errors in terminal
- Try: `npm start` with verbose logging

### No devices showing
- Verify API credentials are correct
- Check you selected the right region
- Ensure devices are linked in Tuya developer console
- Make sure devices are online in mobile app

### Build fails
- Ensure you're on macOS
- Delete dist folder: `rm -rf dist`
- Reinstall dependencies: `npm install`
- Try again: `npm run build`

## 📚 Next Steps

- **Customize**: Edit the UI in `src/index.html` and `src/styles.css`
- **Add Features**: Modify `src/renderer.js` for new functionality
- **Integrate Real API**: See `DEVELOPMENT.md` for Tuya API integration
- **Deploy**: Build and share your app with others

## 🔗 Helpful Links

- [Full Documentation](README.md)
- [Installation Guide](INSTALL.md)
- [Developer Guide](DEVELOPMENT.md)
- [Tuya IoT Platform](https://iot.tuya.com/)
- [Tuya API Docs](https://developer.tuya.com/en/docs/cloud)

## ⚡ Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Run app in development mode |
| `npm run build` | Build for Intel Mac (DMG + ZIP) |
| `npm run build:dmg` | Build DMG installer only |
| `npm run pack` | Package without creating installers |

## 💡 Tips

1. **Development Mode**: Set `NODE_ENV=development` to enable DevTools
2. **Sample Devices**: Uncomment the sample device code in `renderer.js` for testing
3. **Debugging**: Open DevTools with `Cmd+Option+I` when in development mode
4. **Logs**: Check Console in DevTools for renderer process logs, terminal for main process

---

**Need Help?** Open an issue on GitHub or check the documentation!
