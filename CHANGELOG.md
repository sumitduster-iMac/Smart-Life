# Changelog

All notable changes to the Smart Life macOS application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-03

### Added
- Initial release of Smart Life for Intel Mac
- Electron-based desktop application for macOS
- Support for Intel Mac (x64 architecture)
- Device management interface
  - View all connected Tuya smart devices
  - Device status monitoring (online/offline)
  - Device type icons and categorization
- Device control functionality
  - Power on/off controls
  - Brightness adjustment for smart lights
  - Temperature controls for thermostats
  - Extensible control system for various device types
- Settings management
  - Tuya API credential configuration
  - Multi-region support (US, EU, CN, IN)
  - Persistent storage of user preferences
- Native macOS features
  - macOS menu bar integration
  - Native window controls
  - Keyboard shortcuts (Cmd+Q to quit, Cmd+, for preferences)
  - macOS-style modals and UI elements
- User interface
  - Modern, clean design
  - Responsive layout
  - Device grid view
  - Empty state for no devices
  - Connection status indicator
- Security features
  - Encrypted credential storage using electron-store
  - No third-party data collection
  - HTTPS-only API communication
- Documentation
  - Comprehensive README with setup instructions
  - INSTALL.md for end-user installation guide
  - DEVELOPMENT.md for developer documentation
  - QUICKSTART.md for rapid setup
  - Inline code comments
- Build system
  - electron-builder configuration
  - DMG installer generation
  - ZIP archive creation
  - Intel Mac (x64) specific builds

### Technical Details
- Built with Electron 27.0.0
- Node.js-based backend
- Vanilla JavaScript frontend (no framework dependencies)
- CSS3 with CSS variables for theming
- IPC communication between main and renderer processes
- electron-store for persistent data storage

### Known Limitations
- Requires manual API credential configuration
- Intel Mac only (no Apple Silicon native build in this version)
- English language only

### Future Considerations
- Apple Silicon (ARM64) support
- Auto-update functionality
- Multiple language support
- Device grouping and scenes
- Automation and scheduling
- Push notifications
- Dark mode support

## [Unreleased]

### Added
- **Full Tuya API Integration** - Complete integration with Tuya IoT Cloud Platform
  - Real device discovery from Tuya Cloud
  - Live device control (power, brightness, temperature)
  - Support for multiple device types (lights, plugs, thermostats, switches, fans, cameras, locks, sensors)
  - Connection testing functionality
  - Automatic device caching with fallback on network errors
  - Device details and status retrieval
- Tuya Service Module (`src/services/tuyaService.js`)
  - Centralized API communication
  - Device transformation and mapping
  - Command translation for different device types
  - Error handling and retry logic
- Enhanced Settings UI
  - Test Connection button to verify credentials
  - Visual feedback for connection status
  - Improved error messages
- Documentation updates
  - Updated README with API integration status
  - Enhanced DEVELOPMENT.md with implementation details

### Changed
- IPC handlers now use real Tuya API instead of placeholders
- Device list refreshes from Tuya Cloud instead of local storage
- Settings save now initializes Tuya API connection
- UI messages updated to reflect working API integration

### Technical Updates
- Added `@tuya/tuya-connector-nodejs` v2.1.2 dependency
- Implemented proper error handling for API calls
- Added device status and details IPC handlers

### Known Issues
- `@tuya/tuya-connector-nodejs` has transitive axios dependencies with known vulnerabilities (no fix available yet from upstream)

## [1.0.0] - 2026-01-03

### Planned Features
- Real-time device synchronization with Tuya Cloud
- Device automation and scenes
- Energy monitoring and statistics
- Device sharing between users
- Backup and restore settings
- Universal binary (Intel + Apple Silicon)

---

## Release Notes

### Version 1.0.0

This is the initial release of Smart Life for Intel Mac. The application provides a solid foundation for controlling Tuya smart home devices from your Mac computer.

**Key Features:**
- ✅ Beautiful native macOS interface
- ✅ Secure credential storage
- ✅ Device management UI
- ✅ Extensible architecture
- ✅ Ready for Tuya API integration

**Getting Started:**
1. Install Node.js 16 or later
2. Clone the repository
3. Run `npm install`
4. Run `npm start`
5. Configure your Tuya API credentials
6. Control your devices!

**For End Users:**
Download the DMG from the releases page and follow the installation instructions in INSTALL.md

**For Developers:**
See DEVELOPMENT.md for detailed information on architecture, API integration, and contributing.

---

**Download:** [Releases](https://github.com/sumitduster-iMac/Smart-Life/releases)
**Documentation:** [README.md](README.md)
**Support:** [Issues](https://github.com/sumitduster-iMac/Smart-Life/issues)
