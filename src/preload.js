const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Device management
  getDevices: () => ipcRenderer.invoke('get-devices'),
  saveDevices: (devices) => ipcRenderer.invoke('save-devices', devices),
  controlDevice: (deviceId, command) => ipcRenderer.invoke('control-device', deviceId, command),
  
  // User configuration
  getUserConfig: () => ipcRenderer.invoke('get-user-config'),
  saveUserConfig: (config) => ipcRenderer.invoke('save-user-config', config),
  
  // Connection testing
  testConnection: () => ipcRenderer.invoke('test-connection'),
  
  // Event listeners
  onOpenPreferences: (callback) => ipcRenderer.on('open-preferences', callback)
});
