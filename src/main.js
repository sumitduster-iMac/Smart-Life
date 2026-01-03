const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const tuyaService = require('./services/tuyaService');

// Disable GPU acceleration for better compatibility
app.disableHardwareAcceleration();

// Set name explicitly for macOS
app.setName('Smart Life');

// Initialize electron store for persisting user preferences
const store = new Store();

let mainWindow;

// Handle app not ready errors
app.on('will-finish-launching', () => {
  console.log('App is preparing to launch...');
});

function createWindow() {
  try {
    console.log('Creating main window...');
    
    // Create the browser window
    const windowOptions = {
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        // Add these for better compatibility
        sandbox: false,
        webSecurity: true
      },
      titleBarStyle: 'default',
      show: false,
      // Add macOS specific options
      backgroundColor: '#ffffff'
    };

    // Add icon if it exists
    const iconPath = path.join(__dirname, '../assets/icon.png');
    if (fs.existsSync(iconPath)) {
      windowOptions.icon = iconPath;
      console.log('Icon loaded from:', iconPath);
    } else {
      console.warn('Icon not found at:', iconPath);
    }

    mainWindow = new BrowserWindow(windowOptions);

    // Load the index.html
    const htmlPath = path.join(__dirname, 'index.html');
    console.log('Loading HTML from:', htmlPath);
    
    mainWindow.loadFile(htmlPath).catch(err => {
      console.error('Failed to load HTML:', err);
      dialog.showErrorBox('Load Error', 'Failed to load application interface: ' + err.message);
    });

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
      console.log('Window ready to show');
      mainWindow.show();
      console.log('Window shown successfully');
    });

    // Create application menu
    createMenu();

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      console.log('Window closed');
      mainWindow = null;
    });
    
    // Log when window is created
    console.log('Main window created successfully');
  } catch (error) {
    console.error('Error creating window:', error);
    dialog.showErrorBox('Startup Error', 'Failed to create application window: ' + error.message);
  }
}

function createMenu() {
  const template = [
    {
      label: 'Smart Life',
      submenu: [
        {
          label: 'About Smart Life',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'Cmd+,',
          click: () => {
            // Open preferences window
            if (mainWindow) {
              mainWindow.webContents.send('open-preferences');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Cmd+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Tuya Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://developer.tuya.com/en/docs/iot');
          }
        },
        {
          label: 'Smart Life Support',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/sumitduster-iMac/Smart-Life');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('get-devices', async () => {
  try {
    // Check if API is configured
    const config = {
      apiKey: store.get('apiKey', ''),
      apiSecret: store.get('apiSecret', ''),
      endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
    };

    if (!config.apiKey || !config.apiSecret) {
      console.log('API not configured, returning stored devices');
      return store.get('devices', []);
    }

    // Initialize Tuya API if not already initialized
    if (!tuyaService.isConnected()) {
      await tuyaService.initialize(config);
    }

    // Fetch devices from Tuya Cloud
    const devices = await tuyaService.getDevices();
    
    // Cache devices locally
    store.set('devices', devices);
    
    console.log(`Fetched ${devices.length} devices from Tuya Cloud`);
    return devices;
  } catch (error) {
    console.error('Error getting devices:', error);
    // Fallback to cached devices on error
    const cachedDevices = store.get('devices', []);
    console.log(`Returning ${cachedDevices.length} cached devices due to error`);
    return cachedDevices;
  }
});

ipcMain.handle('save-devices', async (event, devices) => {
  store.set('devices', devices);
  return { success: true };
});

ipcMain.handle('get-user-config', async () => {
  return {
    apiKey: store.get('apiKey', ''),
    apiSecret: store.get('apiSecret', ''),
    endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
  };
});

ipcMain.handle('save-user-config', async (event, config) => {
  try {
    // Save configuration
    store.set('apiKey', config.apiKey);
    store.set('apiSecret', config.apiSecret);
    store.set('endpoint', config.endpoint);
    
    // Initialize Tuya API with new config
    if (config.apiKey && config.apiSecret && config.endpoint) {
      await tuyaService.initialize(config);
      console.log('Tuya API initialized with new configuration');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving config:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('control-device', async (event, deviceId, command) => {
  try {
    // Check if API is initialized
    if (!tuyaService.isConnected()) {
      const config = {
        apiKey: store.get('apiKey', ''),
        apiSecret: store.get('apiSecret', ''),
        endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
      };
      
      if (!config.apiKey || !config.apiSecret) {
        throw new Error('API not configured. Please configure your API settings first.');
      }
      
      await tuyaService.initialize(config);
    }

    // Send command to device
    const result = await tuyaService.controlDevice(deviceId, command);
    console.log(`Device ${deviceId} controlled successfully:`, command);
    
    return result;
  } catch (error) {
    console.error(`Error controlling device ${deviceId}:`, error);
    return { success: false, message: error.message };
  }
});

// Add new IPC handler for testing connection
ipcMain.handle('test-connection', async () => {
  try {
    const config = {
      apiKey: store.get('apiKey', ''),
      apiSecret: store.get('apiSecret', ''),
      endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
    };
    
    if (!config.apiKey || !config.apiSecret) {
      return { success: false, message: 'API credentials not configured' };
    }
    
    if (!tuyaService.isConnected()) {
      await tuyaService.initialize(config);
    }
    
    const isConnected = await tuyaService.testConnection();
    
    if (isConnected) {
      return { success: true, message: 'Successfully connected to Tuya Cloud' };
    } else {
      return { success: false, message: 'Failed to connect to Tuya Cloud' };
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, message: error.message };
  }
});

// Add IPC handler for getting device details
ipcMain.handle('get-device-details', async (event, deviceId) => {
  try {
    if (!tuyaService.isConnected()) {
      const config = {
        apiKey: store.get('apiKey', ''),
        apiSecret: store.get('apiSecret', ''),
        endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
      };
      
      if (!config.apiKey || !config.apiSecret) {
        throw new Error('API not configured');
      }
      
      await tuyaService.initialize(config);
    }

    const details = await tuyaService.getDeviceDetails(deviceId);
    return { success: true, device: details };
  } catch (error) {
    console.error(`Error getting device details for ${deviceId}:`, error);
    return { success: false, message: error.message };
  }
});

// Add IPC handler for getting device status
ipcMain.handle('get-device-status', async (event, deviceId) => {
  try {
    if (!tuyaService.isConnected()) {
      const config = {
        apiKey: store.get('apiKey', ''),
        apiSecret: store.get('apiSecret', ''),
        endpoint: store.get('endpoint', 'https://openapi.tuyaus.com')
      };
      
      if (!config.apiKey || !config.apiSecret) {
        throw new Error('API not configured');
      }
      
      await tuyaService.initialize(config);
    }

    const status = await tuyaService.getDeviceStatus(deviceId);
    return { success: true, status: status };
  } catch (error) {
    console.error(`Error getting device status for ${deviceId}:`, error);
    return { success: false, message: error.message };
  }
});

// App lifecycle
app.whenReady().then(() => {
  console.log('App is ready, creating window...');
  createWindow();
}).catch(err => {
  console.error('App failed to become ready:', err);
  // Only try to show error dialog if app is actually ready
  if (app.isReady()) {
    try {
      dialog.showErrorBox('Startup Error', 'Application failed to start: ' + err.message);
    } catch (e) {
      console.error('Failed to show error dialog:', e);
    }
  }
  // Exit with error code
  process.exit(1);
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle app errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  try {
    dialog.showErrorBox('Application Error', 'An unexpected error occurred: ' + error.message);
  } catch (e) {
    console.error('Failed to show error dialog:', e);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
