# Tuya API Integration Guide

This document explains the Tuya API integration implementation in Smart Life.

## Overview

Smart Life now includes **full Tuya API integration**, enabling you to discover, monitor, and control your real Tuya smart home devices directly from your Mac.

## Architecture

### Components

1. **Tuya Service Module** (`src/services/tuyaService.js`)
   - Core API communication layer
   - Handles device discovery, control, and status queries
   - Manages API authentication and connection
   - Transforms data between Tuya format and app format

2. **Main Process** (`src/main.js`)
   - IPC handlers for renderer communication
   - Configuration management
   - API initialization
   - Device caching for offline support

3. **Renderer Process** (`src/renderer.js`)
   - UI interactions
   - Device display and control
   - Settings management
   - Connection testing

## Features

### Device Discovery
- Automatically fetches all devices from your Tuya account
- Supports pagination for large device lists
- Caches devices locally for offline viewing
- Automatic fallback to cached devices on network errors

### Device Control
- Real-time device control via Tuya Cloud
- Support for multiple command types:
  - Power on/off
  - Brightness adjustment
  - Temperature control
- Smart command translation for different device types

### Supported Device Types
- 💡 Lights (`dj`)
- 🔌 Plugs (`cz`)
- 🌡️ Thermostats (`wk`)
- ⚡ Switches (`kg`)
- 🌀 Fans (`fs`)
- 📷 Cameras (`sp`)
- 🔒 Locks (`ms`)
- 📡 Sensors (`mcs`)

### Multi-Region Support
- United States: `https://openapi.tuyaus.com`
- Europe: `https://openapi.tuyaeu.com`
- China: `https://openapi.tuyacn.com`
- India: `https://openapi.tuyain.com`

## Usage

### Setting Up API Credentials

1. **Get Tuya Developer Credentials:**
   - Go to [Tuya IoT Platform](https://iot.tuya.com/)
   - Create a new project or use existing one
   - Get your Access ID (API Key) and Access Secret (API Secret)
   - Note your data center region

2. **Configure in Smart Life:**
   - Open Smart Life
   - Click ⚙️ Settings
   - Enter your API Key and API Secret
   - Select your endpoint region
   - Click "Test Connection" to verify
   - Click "Save Settings"

3. **Load Your Devices:**
   - Click the 🔄 Refresh button
   - Your devices will be fetched from Tuya Cloud
   - Click any device to control it

### API Methods

#### Initialize Connection
```javascript
await tuyaService.initialize({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  endpoint: 'https://openapi.tuyaus.com'
});
```

#### Get Devices
```javascript
const devices = await tuyaService.getDevices();
// Returns array of transformed device objects
```

#### Control Device
```javascript
await tuyaService.controlDevice('device-id', {
  power: true,
  brightness: 80,
  temperature: 72
});
```

#### Get Device Details
```javascript
const device = await tuyaService.getDeviceDetails('device-id');
```

#### Get Device Status
```javascript
const status = await tuyaService.getDeviceStatus('device-id');
```

#### Test Connection
```javascript
const isConnected = await tuyaService.testConnection();
```

## Device Data Transformation

### Tuya Device Format
```json
{
  "id": "device123",
  "name": "Living Room Light",
  "category": "dj",
  "online": true,
  "status": [
    {"code": "switch_led", "value": true},
    {"code": "bright_value", "value": 80}
  ]
}
```

### App Device Format
```json
{
  "id": "device123",
  "name": "Living Room Light",
  "type": "light",
  "online": true,
  "power": true,
  "brightness": 80,
  "temperature": 72
}
```

## Command Translation

The service automatically translates app commands to Tuya-compatible format:

| App Command | Tuya Codes | Values |
|-------------|------------|---------|
| `power` | `switch_led`, `switch`, `switch_1` | boolean |
| `brightness` | `bright_value`, `brightness` | 0-100 |
| `temperature` | `temp_set`, `temperature` | integer |

**Note:** Multiple command codes are sent for compatibility with different device manufacturers. The Tuya API executes only valid commands for each device.

## Error Handling

### Network Errors
- Automatic retry on transient failures
- Fallback to cached devices when API is unavailable
- User-friendly error messages

### API Errors
- Invalid credentials detection
- Rate limiting handling
- Device offline detection

### Connection Testing
- Lightweight endpoint for testing
- Validates credentials before saving
- Provides immediate feedback

## IPC Communication

### Available IPC Handlers

| Handler | Purpose | Parameters |
|---------|---------|------------|
| `get-devices` | Fetch all devices | None |
| `save-devices` | Save devices to cache | devices array |
| `control-device` | Send command to device | deviceId, command |
| `get-device-details` | Get full device info | deviceId |
| `get-device-status` | Get device status | deviceId |
| `get-user-config` | Get API credentials | None |
| `save-user-config` | Save API credentials | config object |
| `test-connection` | Test API connection | None |

### Example IPC Usage

From renderer process:
```javascript
// Get devices
const devices = await window.electronAPI.getDevices();

// Control device
await window.electronAPI.controlDevice('device-id', { power: true });

// Test connection
const result = await window.electronAPI.testConnection();
```

## Security

- API credentials stored encrypted via electron-store
- All API communication over HTTPS
- No credentials sent to third parties
- Secure IPC communication via context isolation

## Known Issues

### Transitive Dependencies
The `@tuya/tuya-connector-nodejs` package includes `axios` with known vulnerabilities:
- CVE-2024-XXXX: CSRF vulnerability (moderate)
- CVE-2024-YYYY: DoS vulnerability (high)
- CVE-2024-ZZZZ: SSRF vulnerability (high)

**Mitigation:** These are in upstream dependencies with no fixes available. The app uses the Tuya SDK as-is. Monitor for SDK updates.

## Troubleshooting

### Devices Not Loading
1. Verify API credentials are correct
2. Check your internet connection
3. Ensure you selected the correct region
4. Verify devices are online in Tuya mobile app
5. Check console logs for error messages

### Device Control Not Working
1. Ensure device is online
2. Check that device supports the command type
3. Verify your Tuya project has necessary permissions
4. Try controlling device via Tuya mobile app first

### Connection Test Fails
1. Double-check API Key and Secret
2. Verify endpoint region matches your account
3. Check firewall/proxy settings
4. Ensure your Tuya project is active

## Future Enhancements

Potential improvements for future releases:
- WebSocket support for real-time device updates
- Device grouping and scenes
- Automation rules
- Energy monitoring
- Historical data and statistics
- Offline device control
- Device discovery via local network

## References

- [Tuya IoT Platform](https://iot.tuya.com/)
- [Tuya Cloud API Documentation](https://developer.tuya.com/en/docs/cloud)
- [Tuya Device Categories](https://developer.tuya.com/en/docs/iot/standarddescription?id=K9i5ql6waswzq)
- [SDK GitHub Repository](https://github.com/tuya/tuya-connector-nodejs)

## Support

For issues or questions:
- GitHub Issues: [Smart-Life/issues](https://github.com/sumitduster-iMac/Smart-Life/issues)
- Tuya Developer Forum: [tuyaos.com](https://www.tuyaos.com/)
