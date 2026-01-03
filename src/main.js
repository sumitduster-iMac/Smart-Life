const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize electron store for persisting user preferences
const store = new Store();

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create application menu
  createMenu();

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
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
  // Placeholder for Tuya API integration
  // In production, this would connect to Tuya Cloud API
  return store.get('devices', []);
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
  store.set('apiKey', config.apiKey);
  store.set('apiSecret', config.apiSecret);
  store.set('endpoint', config.endpoint);
  return { success: true };
});

ipcMain.handle('control-device', async (event, deviceId, command) => {
  // Placeholder for device control via Tuya API
  console.log(`Control device ${deviceId} with command:`, command);
  return { success: true, message: 'Command sent successfully' };
});

// App lifecycle
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle app errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
