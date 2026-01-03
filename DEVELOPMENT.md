# Developer Guide

## Development Setup

### Prerequisites
- macOS 10.13+
- Node.js 16+
- npm or yarn
- Git
- Basic knowledge of JavaScript, HTML, CSS
- Familiarity with Electron framework

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/sumitduster-iMac/Smart-Life.git
cd Smart-Life
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

## Project Architecture

### Technology Stack
- **Electron**: Cross-platform desktop app framework
- **Node.js**: Backend runtime
- **HTML/CSS/JavaScript**: Frontend
- **electron-store**: Persistent storage for settings

### Process Architecture

**Main Process** (`src/main.js`):
- Creates and manages application windows
- Handles system-level operations
- Manages IPC communication with renderer
- Implements native menus

**Renderer Process** (`src/renderer.js`):
- Manages UI state and interactions
- Handles user input
- Communicates with main process via IPC
- Updates device display

### File Structure
```
src/
├── main.js         # Main process entry point
├── renderer.js     # Renderer process logic
├── index.html      # Main application UI
└── styles.css      # Application styles

assets/             # Icons and images
package.json        # Dependencies and build config
```

## Key Components

### IPC Communication

The app uses Electron's IPC (Inter-Process Communication) for communication between main and renderer processes:

**From Renderer to Main**:
```javascript
// Get devices
const devices = await ipcRenderer.invoke('get-devices');

// Save configuration
await ipcRenderer.invoke('save-user-config', config);

// Control device
await ipcRenderer.invoke('control-device', deviceId, command);
```

**From Main to Renderer**:
```javascript
// Send event from menu
mainWindow.webContents.send('open-preferences');
```

### Data Storage

Uses `electron-store` for persistent storage:
- API credentials (encrypted)
- Device list
- User preferences

Storage location: `~/Library/Application Support/smart-life-mac/`

### Device Management

Device objects structure:
```javascript
{
  id: 'device-001',
  name: 'Living Room Light',
  type: 'light',
  online: true,
  power: false,
  brightness: 80
}
```

## Adding New Features

### Adding a New Device Type

1. Add icon mapping in `renderer.js`:
```javascript
const icons = {
  'new-type': '🆕',
  // ... existing types
};
```

2. Add type-specific controls in `generateDeviceControls()`:
```javascript
if (device.type === 'new-type') {
  html += `
    <div class="control-group">
      <label>Custom Control</label>
      <input type="..." id="customControl">
    </div>
  `;
}
```

3. Add control listeners in `setupDeviceControlListeners()`:
```javascript
const customControl = document.getElementById('customControl');
if (customControl) {
  customControl.addEventListener('change', async (e) => {
    await controlDevice(device.id, { custom: e.target.value });
  });
}
```

### Adding a New API Integration

1. Create IPC handler in `main.js`:
```javascript
ipcMain.handle('your-api-call', async (event, params) => {
  // Implementation
  return result;
});
```

2. Call from renderer:
```javascript
const result = await ipcRenderer.invoke('your-api-call', params);
```

## Tuya API Integration

### Current Implementation
The Tuya API integration is now **fully implemented** using the `@tuya/tuya-connector-nodejs` SDK.

**Key Features:**
- Full device discovery from Tuya Cloud
- Real-time device control (power, brightness, temperature)
- Support for multiple device types (lights, plugs, thermostats, switches, fans, cameras, locks, sensors)
- Multi-region support (US, EU, CN, IN)
- Connection testing before saving credentials
- Automatic fallback to cached devices on network errors

**Implementation Details:**

1. Tuya Service Module (`src/services/tuyaService.js`):
   - Centralized API communication
   - Device transformation and mapping
   - Error handling and retry logic
   - Command translation for different device types

2. Main Process Integration (`src/main.js`):
   - IPC handlers for device operations
   - API initialization on config save
   - Cached device fallback on errors

3. Usage Example:
```javascript
// In main process
const tuyaService = require('./services/tuyaService');

// Initialize
await tuyaService.initialize({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  endpoint: 'https://openapi.tuyaus.com'
});

// Get devices
const devices = await tuyaService.getDevices();

// Control device
await tuyaService.controlDevice(deviceId, { power: true });

// Test connection
const isConnected = await tuyaService.testConnection();
```

### API Endpoints
- US: https://openapi.tuyaus.com
- EU: https://openapi.tuyaeu.com  
- CN: https://openapi.tuyacn.com
- IN: https://openapi.tuyain.com

## Building

### Development Build
```bash
npm start
```

### Production Build
```bash
# Build for Intel Mac
npm run build

# Build DMG only
npm run build:dmg

# Package without installers
npm run pack
```

### Build Configuration

The build is configured in `package.json` under the `build` section:
- Target: Intel Mac (x64)
- Output formats: DMG and ZIP
- App ID: com.smartlife.mac
- Category: Lifestyle

### Code Signing (Optional)

To sign the app with your Apple Developer certificate:

1. Get a Developer ID certificate from Apple
2. Update `package.json`:
```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)"
  }
}
```

## Testing

### Manual Testing
1. Test on Intel Mac hardware
2. Verify all UI interactions
3. Test with real Tuya devices
4. Test API credential validation
5. Test offline behavior

### Test Checklist
- [ ] App launches successfully
- [ ] Settings can be saved and loaded
- [ ] Devices display correctly
- [ ] Device controls work
- [ ] Menu items function
- [ ] App quits cleanly
- [ ] Build creates valid DMG/ZIP

## Debugging

### Enable DevTools
Set environment variable:
```bash
NODE_ENV=development npm start
```

Or add to main.js:
```javascript
mainWindow.webContents.openDevTools();
```

### Console Logging
- Main process logs: Terminal where you ran `npm start`
- Renderer process logs: DevTools console

### Common Issues

**Module not found**:
- Run `npm install` again
- Delete `node_modules` and reinstall

**Build fails**:
- Check electron-builder is installed
- Verify package.json build config
- Clear dist folder

## Contributing

### Code Style
- Use ES6+ features
- 2-space indentation
- Semicolons required
- Descriptive variable names

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference issues when applicable

### Pull Requests
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with description

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Tuya API Docs](https://developer.tuya.com/en/docs/cloud)
- [electron-store](https://github.com/sindresorhus/electron-store)
- [electron-builder](https://www.electron.build/)

## License

MIT License - see LICENSE file for details
