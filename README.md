# Smart Life - macOS App

A native macOS application for controlling your Tuya smart home devices. Built with Electron for Intel Mac compatibility.

## 🏠 Features

- **Device Control**: Control all your Tuya-compatible smart home devices from your Mac
- **Native macOS Experience**: Built with macOS design principles and native menus
- **Real-time Updates**: Monitor and control devices in real-time
- **Secure Storage**: Encrypted storage for API credentials using electron-store
- **Multi-region Support**: Connect to Tuya cloud servers in different regions
- **Intel Mac Optimized**: Specifically built and optimized for Intel-based Macs

## 📋 Prerequisites

- macOS 10.13 or later
- Intel Mac (x64 architecture)
- Node.js 16 or later
- npm or yarn package manager
- Tuya Developer Account (for API credentials)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sumitduster-iMac/Smart-Life.git
cd Smart-Life
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Tuya API Credentials

1. Go to [Tuya IoT Platform](https://iot.tuya.com/)
2. Create a new project or use an existing one
3. Get your **API Key** (Access ID) and **API Secret** from the project overview
4. Note your data center region (US, EU, CN, or IN)

For detailed instructions, visit: https://developer.tuya.com/en/docs/iot/download?id=Kbd668dicz9r6

### 4. Run the Application

Development mode:
```bash
npm start
```

### 5. Configure API Settings

1. Click the **⚙️ Settings** button in the app
2. Enter your Tuya API Key and API Secret
3. Select your API endpoint region
4. Click **Save Settings**

## 🔨 Building for Distribution

### Build Intel Mac Application

Build DMG installer:
```bash
npm run build:dmg
```

Build ZIP archive:
```bash
npm run build
```

The built applications will be in the `dist` folder.

### Build Output

- `Smart Life-{version}.dmg` - DMG installer for easy installation
- `Smart Life-{version}-mac.zip` - ZIP archive containing the .app bundle

## 📦 Package Scripts

- `npm start` - Run the app in development mode
- `npm run build` - Build the app for Intel Mac (DMG + ZIP)
- `npm run build:dmg` - Build DMG installer only
- `npm run pack` - Package the app without creating installers
- `npm run dist` - Full distribution build

## 🔧 Configuration

### Supported Device Types

The app supports various Tuya device types including:
- 💡 Smart Lights
- 🔌 Smart Plugs/Switches
- 🌡️ Thermostats
- 📷 Security Cameras
- 🔒 Smart Locks
- 📡 Sensors
- 🌀 Fans

### API Endpoints

- **United States**: `https://openapi.tuyaus.com`
- **Europe**: `https://openapi.tuyaeu.com`
- **China**: `https://openapi.tuyacn.com`
- **India**: `https://openapi.tuyain.com`

## 🏗️ Project Structure

```
Smart-Life/
├── src/
│   ├── main.js           # Electron main process
│   ├── renderer.js       # Renderer process (UI logic)
│   ├── index.html        # Main application UI
│   └── styles.css        # Application styles
├── assets/               # Application assets (icons, images)
├── dist/                 # Built applications
├── package.json          # Project dependencies and scripts
└── README.md            # This file
```

## 🔐 Security

- API credentials are stored securely using electron-store with encryption
- No credentials are sent to any third-party servers except Tuya's official APIs
- All communication with Tuya APIs is done over HTTPS

## 🛠️ Troubleshooting

### App won't start
- Ensure you have Node.js 16+ installed
- Delete `node_modules` and run `npm install` again
- Check console for error messages

### Can't connect to devices
- Verify your API credentials are correct
- Ensure you selected the correct API endpoint region
- Check that your devices are online in the Tuya/Smart Life mobile app
- Verify your Tuya project has the necessary API permissions

### Build fails
- Ensure you're running on an Intel Mac
- Check that electron-builder is installed correctly
- Try cleaning the project: `rm -rf dist node_modules && npm install`

## 📚 Resources

- [Tuya IoT Platform](https://iot.tuya.com/)
- [Tuya Developer Documentation](https://developer.tuya.com/en/docs/iot)
- [Tuya API Reference](https://developer.tuya.com/en/docs/cloud)
- [Electron Documentation](https://www.electronjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Powered by [Tuya IoT Platform](https://iot.tuya.com/)
- Icon design inspired by smart home aesthetics

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/sumitduster-iMac/Smart-Life/issues)
- Check [Tuya Developer Forum](https://www.tuyaos.com/)

---

**Note**: This application requires valid Tuya API credentials to function. Make sure to register for a Tuya developer account and create a project to obtain your credentials.