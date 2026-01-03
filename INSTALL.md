# Installation Guide

## For End Users

### Installing from DMG (Recommended)

1. Download the latest `Smart Life-{version}.dmg` from the releases page
2. Double-click the DMG file to mount it
3. Drag the **Smart Life** app to your Applications folder
4. Eject the DMG
5. Open Smart Life from your Applications folder
6. If you see a security warning, go to System Preferences > Security & Privacy and click "Open Anyway"

### Installing from ZIP

1. Download the latest `Smart Life-{version}-mac.zip` from the releases page
2. Double-click the ZIP to extract it
3. Move the **Smart Life.app** to your Applications folder
4. Open Smart Life from your Applications folder

## First Launch Setup

1. Launch Smart Life
2. Click the **⚙️ Settings** button
3. Enter your Tuya API credentials:
   - **API Key**: Your Tuya Access ID
   - **API Secret**: Your Tuya Access Secret
   - **Endpoint**: Select your region
4. Click **Save Settings**
5. Your devices should now appear on the main screen

## Getting Tuya API Credentials

### Step 1: Create Tuya Account
1. Visit https://iot.tuya.com/
2. Sign up or log in with your existing account

### Step 2: Create a Cloud Project
1. Go to "Cloud" > "Development"
2. Click "Create Cloud Project"
3. Select "Smart Home" as the industry
4. Fill in the project details
5. Select your data center (same region as your devices)

### Step 3: Get API Credentials
1. Open your project
2. Go to the "Overview" tab
3. Copy your **Access ID/Client ID** (this is your API Key)
4. Copy your **Access Secret/Client Secret** (this is your API Secret)

### Step 4: Link Your Devices
1. In your project, go to "Devices" > "Link Tuya App Account"
2. Link your Smart Life mobile app account
3. This will give the API access to your devices

### Step 5: Enable Required APIs
1. Go to "API" tab in your project
2. Make sure these APIs are enabled:
   - IoT Core
   - Authorization
   - Smart Home Devices Management

## Troubleshooting

### "App can't be opened because it is from an unidentified developer"

This happens because the app is not signed with an Apple Developer certificate. This is normal for community-built applications.

**Method 1: Using Right-Click (Easiest)**
1. Locate the **Smart Life** app in your Applications folder
2. Right-click (or Control-click) on the app icon
3. Select "Open" from the contextual menu
4. Click "Open" in the security dialog that appears
5. The app will now open and be added to your security exceptions

**Method 2: Using System Preferences**
1. Try to open Smart Life normally (it will be blocked)
2. Open **System Preferences** (or **System Settings** on macOS 13+)
3. Go to **Security & Privacy** (or **Privacy & Security**)
4. Under the "General" tab, you'll see a message about Smart Life being blocked
5. Click **"Open Anyway"**
6. Try opening Smart Life again and confirm when prompted

**Method 3: Using Terminal (For Advanced Users)**
If the above methods don't work, you can remove the quarantine attribute:
```bash
xattr -cr /Applications/Smart\ Life.app
```

**Important Notes:**
- You only need to do this once per installation
- After the first successful launch, macOS will remember your choice
- This app is safe to run - it's open source and the code is available on GitHub

### "Smart Life is damaged and can't be opened" or DMG won't mount

This can happen on macOS 10.15+ (Catalina and later) due to Gatekeeper.

**Solution**:
1. Open Terminal (Applications > Utilities > Terminal)
2. Run this command to remove the quarantine attribute from the DMG:
   ```bash
   xattr -d com.apple.quarantine ~/Downloads/Smart\ Life-*.dmg
   ```
3. Now try mounting the DMG again

**Alternative for the app itself:**
```bash
sudo xattr -cr /Applications/Smart\ Life.app
```

### No devices showing up

**Check**:
1. Your API credentials are correct
2. You selected the correct region/endpoint
3. Your devices are online in the Tuya/Smart Life mobile app
4. You linked your mobile app account in the Tuya developer console
5. Your project has the necessary API permissions enabled

### Connection issues

**Check**:
1. You have internet connectivity
2. Your firewall isn't blocking the app
3. The Tuya cloud service is operational (check status.tuya.com if available)

## Uninstalling

1. Close Smart Life if it's running
2. Go to Applications folder
3. Drag Smart Life to the Trash
4. Empty Trash

To remove all data:
```bash
rm -rf ~/Library/Application\ Support/smart-life-mac
```

## System Requirements

- **Operating System**: macOS 10.13 (High Sierra) or later
- **Architecture**: Intel x64 (Intel Macs)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 200MB free space
- **Internet**: Required for device control

## Privacy & Security

- Your API credentials are stored locally on your Mac using encrypted storage
- No data is sent to any third-party servers
- All communication is directly with Tuya's official cloud servers over HTTPS
- The app does not collect any analytics or telemetry

## Updates

To update to a new version:
1. Download the latest version
2. Follow the installation steps above
3. Your settings and preferences will be preserved

---

For more help, visit: https://github.com/sumitduster-iMac/Smart-Life/issues
