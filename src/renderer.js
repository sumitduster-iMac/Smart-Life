const { ipcRenderer } = require('electron');

// State management
let devices = [];
let userConfig = {};

// DOM Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const deviceModal = document.getElementById('deviceModal');
const settingsForm = document.getElementById('settingsForm');
const devicesContainer = document.getElementById('devicesContainer');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const addDeviceBtn = document.getElementById('addDeviceBtn');
const connectionStatus = document.getElementById('connectionStatus');

// Modal close buttons
const closeButtons = document.querySelectorAll('.close-btn');
const cancelBtn = document.querySelector('.cancel-btn');

// Initialize app
async function init() {
    await loadUserConfig();
    await loadDevices();
    setupEventListeners();
    updateConnectionStatus();
}

// Load user configuration
async function loadUserConfig() {
    try {
        userConfig = await ipcRenderer.invoke('get-user-config');
        if (userConfig.apiKey) {
            document.getElementById('apiKey').value = userConfig.apiKey;
        }
        if (userConfig.apiSecret) {
            document.getElementById('apiSecret').value = userConfig.apiSecret;
        }
        if (userConfig.endpoint) {
            document.getElementById('endpoint').value = userConfig.endpoint;
        }
    } catch (error) {
        console.error('Error loading user config:', error);
    }
}

// Load devices
async function loadDevices() {
    try {
        devices = await ipcRenderer.invoke('get-devices');
        renderDevices();
    } catch (error) {
        console.error('Error loading devices:', error);
        showNotification('Failed to load devices', 'error');
    }
}

// Render devices in the grid
function renderDevices() {
    if (devices.length === 0) {
        devicesContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    devicesContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    devicesContainer.innerHTML = devices.map(device => `
        <div class="device-card" data-device-id="${device.id}">
            <span class="device-icon">${getDeviceIcon(device.type)}</span>
            <h3>${device.name}</h3>
            <p class="device-type">${device.type || 'Smart Device'}</p>
            <span class="device-status ${device.online ? 'online' : 'offline'}">
                ${device.online ? 'Online' : 'Offline'}
            </span>
        </div>
    `).join('');

    // Add click handlers to device cards
    document.querySelectorAll('.device-card').forEach(card => {
        card.addEventListener('click', () => {
            const deviceId = card.dataset.deviceId;
            openDeviceControl(deviceId);
        });
    });
}

// Get device icon based on type
function getDeviceIcon(type) {
    const icons = {
        'light': '💡',
        'switch': '🔌',
        'thermostat': '🌡️',
        'camera': '📷',
        'lock': '🔒',
        'sensor': '📡',
        'fan': '🌀',
        'plug': '🔌',
        'default': '🏠'
    };
    return icons[type?.toLowerCase()] || icons.default;
}

// Open device control modal
function openDeviceControl(deviceId) {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    document.getElementById('deviceName').textContent = device.name;
    
    const controlsHtml = generateDeviceControls(device);
    document.getElementById('deviceControls').innerHTML = controlsHtml;
    
    deviceModal.classList.add('active');
    
    // Setup control event listeners
    setupDeviceControlListeners(device);
}

// Generate device controls based on device type
function generateDeviceControls(device) {
    let html = `
        <div class="control-group">
            <label>Power</label>
            <label class="toggle-switch">
                <input type="checkbox" id="powerToggle" ${device.power ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
    `;

    // Add type-specific controls
    if (device.type === 'light') {
        html += `
            <div class="control-group">
                <label>Brightness</label>
                <input type="range" id="brightnessSlider" min="0" max="100" value="${device.brightness || 50}">
            </div>
        `;
    }

    if (device.type === 'thermostat') {
        html += `
            <div class="control-group">
                <label>Temperature</label>
                <input type="number" id="tempControl" min="60" max="85" value="${device.temperature || 72}">
            </div>
        `;
    }

    return html;
}

// Setup device control listeners
function setupDeviceControlListeners(device) {
    const powerToggle = document.getElementById('powerToggle');
    if (powerToggle) {
        powerToggle.addEventListener('change', async (e) => {
            await controlDevice(device.id, { power: e.target.checked });
        });
    }

    const brightnessSlider = document.getElementById('brightnessSlider');
    if (brightnessSlider) {
        brightnessSlider.addEventListener('change', async (e) => {
            await controlDevice(device.id, { brightness: parseInt(e.target.value) });
        });
    }

    const tempControl = document.getElementById('tempControl');
    if (tempControl) {
        tempControl.addEventListener('change', async (e) => {
            await controlDevice(device.id, { temperature: parseInt(e.target.value) });
        });
    }
}

// Control device via API
async function controlDevice(deviceId, command) {
    try {
        const result = await ipcRenderer.invoke('control-device', deviceId, command);
        if (result.success) {
            showNotification('Command sent successfully', 'success');
            // Update local device state
            const device = devices.find(d => d.id === deviceId);
            if (device) {
                Object.assign(device, command);
            }
        } else {
            showNotification('Failed to send command', 'error');
        }
    } catch (error) {
        console.error('Error controlling device:', error);
        showNotification('Error controlling device', 'error');
    }
}

// Update connection status
function updateConnectionStatus() {
    const statusIndicator = connectionStatus.querySelector('.status-indicator');
    const statusText = connectionStatus.querySelector('.status-text');
    
    if (userConfig.apiKey && userConfig.apiSecret) {
        statusIndicator.classList.add('connected');
        statusText.textContent = 'Connected';
    } else {
        statusIndicator.classList.remove('connected');
        statusText.textContent = 'Not Connected - Configure API settings';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Simple console log for now
    // In production, implement a toast notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Event Listeners
function setupEventListeners() {
    // Settings button
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    // Close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
            deviceModal.classList.remove('active');
        });
    });

    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    // Settings form
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const config = {
            apiKey: document.getElementById('apiKey').value,
            apiSecret: document.getElementById('apiSecret').value,
            endpoint: document.getElementById('endpoint').value
        };

        try {
            const result = await ipcRenderer.invoke('save-user-config', config);
            if (result.success) {
                userConfig = config;
                updateConnectionStatus();
                settingsModal.classList.remove('active');
                showNotification('Settings saved successfully', 'success');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotification('Failed to save settings', 'error');
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', async () => {
        showNotification('Refreshing devices...', 'info');
        await loadDevices();
    });

    // Add device button
    addDeviceBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        showNotification('Configure your API settings to add devices', 'info');
    });

    // Close modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    deviceModal.addEventListener('click', (e) => {
        if (e.target === deviceModal) {
            deviceModal.classList.remove('active');
        }
    });

    // Listen for preferences event from menu
    ipcRenderer.on('open-preferences', () => {
        settingsModal.classList.add('active');
    });
}

// Add sample devices for demonstration
async function addSampleDevices() {
    const sampleDevices = [
        {
            id: 'device-001',
            name: 'Living Room Light',
            type: 'light',
            online: true,
            power: false,
            brightness: 80
        },
        {
            id: 'device-002',
            name: 'Smart Plug',
            type: 'plug',
            online: true,
            power: true
        },
        {
            id: 'device-003',
            name: 'Thermostat',
            type: 'thermostat',
            online: false,
            temperature: 72
        }
    ];

    await ipcRenderer.invoke('save-devices', sampleDevices);
    await loadDevices();
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Uncomment to add sample devices for testing
    // setTimeout(addSampleDevices, 1000);
});
