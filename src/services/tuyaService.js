/**
 * Tuya API Service
 * Handles all communication with Tuya IoT Cloud Platform
 */

const { TuyaContext } = require('@tuya/tuya-connector-nodejs');

class TuyaService {
  constructor() {
    this.context = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Tuya API connection
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Tuya API Key (Access ID)
   * @param {string} config.apiSecret - Tuya API Secret
   * @param {string} config.endpoint - Tuya API endpoint URL
   * @returns {Promise<boolean>} - Success status
   */
  async initialize(config) {
    try {
      if (!config.apiKey || !config.apiSecret || !config.endpoint) {
        throw new Error('Missing required configuration: apiKey, apiSecret, or endpoint');
      }

      this.context = new TuyaContext({
        baseUrl: config.endpoint,
        accessKey: config.apiKey,
        secretKey: config.apiSecret,
      });

      this.isInitialized = true;
      console.log('Tuya API initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Tuya API:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Check if service is initialized
   * @returns {boolean}
   */
  isConnected() {
    return this.isInitialized && this.context !== null;
  }

  /**
   * Get user's device list from Tuya Cloud
   * @param {string} userId - User ID (optional, uses default if not provided)
   * @returns {Promise<Array>} - Array of device objects
   */
  async getDevices(userId = null) {
    if (!this.isConnected()) {
      throw new Error('Tuya API not initialized. Please configure API settings first.');
    }

    try {
      // Get user devices
      let devices = [];
      
      // Method 1: Try to get devices by user
      if (userId) {
        try {
          const response = await this.context.request({
            method: 'GET',
            path: `/v1.0/users/${userId}/devices`,
          });
          
          if (response.success && response.result) {
            devices = response.result;
          }
        } catch (err) {
          console.warn('Failed to get devices by user ID:', err.message);
        }
      }

      // Method 2: Try to get all devices (works for some API types)
      if (devices.length === 0) {
        try {
          const response = await this.context.request({
            method: 'GET',
            path: '/v1.0/devices',
          });
          
          if (response.success && response.result && response.result.list) {
            devices = response.result.list;
          } else if (response.success && response.result) {
            devices = response.result;
          }
        } catch (err) {
          console.warn('Failed to get all devices:', err.message);
        }
      }

      // Transform devices to our format
      return devices.map(device => this.transformDevice(device));
    } catch (error) {
      console.error('Error fetching devices from Tuya:', error);
      throw new Error(`Failed to fetch devices: ${error.message}`);
    }
  }

  /**
   * Get device details
   * @param {string} deviceId - Device ID
   * @returns {Promise<Object>} - Device object
   */
  async getDeviceDetails(deviceId) {
    if (!this.isConnected()) {
      throw new Error('Tuya API not initialized');
    }

    try {
      const response = await this.context.request({
        method: 'GET',
        path: `/v1.0/devices/${deviceId}`,
      });

      if (response.success && response.result) {
        return this.transformDevice(response.result);
      }

      throw new Error('Failed to get device details');
    } catch (error) {
      console.error(`Error fetching device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Get device status
   * @param {string} deviceId - Device ID
   * @returns {Promise<Object>} - Device status
   */
  async getDeviceStatus(deviceId) {
    if (!this.isConnected()) {
      throw new Error('Tuya API not initialized');
    }

    try {
      const response = await this.context.request({
        method: 'GET',
        path: `/v1.0/devices/${deviceId}/status`,
      });

      if (response.success && response.result) {
        return response.result;
      }

      return [];
    } catch (error) {
      console.error(`Error fetching status for device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Control a device
   * @param {string} deviceId - Device ID
   * @param {Object} commands - Commands to send
   * @returns {Promise<Object>} - Result object
   */
  async controlDevice(deviceId, commands) {
    if (!this.isConnected()) {
      throw new Error('Tuya API not initialized');
    }

    try {
      // Transform commands to Tuya format
      const tuyaCommands = this.transformCommands(commands);

      const response = await this.context.request({
        method: 'POST',
        path: `/v1.0/devices/${deviceId}/commands`,
        body: {
          commands: tuyaCommands,
        },
      });

      if (response.success) {
        return {
          success: true,
          message: 'Command sent successfully',
        };
      }

      throw new Error(response.msg || 'Failed to send command');
    } catch (error) {
      console.error(`Error controlling device ${deviceId}:`, error);
      throw new Error(`Failed to control device: ${error.message}`);
    }
  }

  /**
   * Transform Tuya device to our app format
   * @param {Object} tuyaDevice - Device from Tuya API
   * @returns {Object} - Transformed device
   */
  transformDevice(tuyaDevice) {
    // Get device type mapping
    const typeMapping = {
      'dj': 'light',
      'cz': 'plug',
      'wk': 'thermostat',
      'kg': 'switch',
      'fs': 'fan',
      'sp': 'camera',
      'ms': 'lock',
      'mcs': 'sensor',
    };

    // Get power status from status array
    let power = false;
    let brightness = 50;
    let temperature = 72;

    if (tuyaDevice.status && Array.isArray(tuyaDevice.status)) {
      for (const status of tuyaDevice.status) {
        if (status.code === 'switch_led' || status.code === 'switch' || status.code === 'switch_1') {
          power = status.value === true || status.value === 'true';
        } else if (status.code === 'bright_value' || status.code === 'brightness') {
          brightness = parseInt(status.value, 10) || 50;
        } else if (status.code === 'temp_set' || status.code === 'temperature') {
          temperature = parseInt(status.value, 10) || 72;
        }
      }
    }

    return {
      id: tuyaDevice.id,
      name: tuyaDevice.name || 'Unknown Device',
      type: typeMapping[tuyaDevice.category] || 'default',
      online: tuyaDevice.online || false,
      power: power,
      brightness: brightness,
      temperature: temperature,
      category: tuyaDevice.category,
      productId: tuyaDevice.product_id,
      model: tuyaDevice.model || '',
    };
  }

  /**
   * Transform app commands to Tuya format
   * @param {Object} commands - Commands from app
   * @returns {Array} - Tuya commands array
   * 
   * Note: Multiple command codes are sent for each property because different
   * Tuya device manufacturers use different codes for the same functionality.
   * The Tuya API will only execute valid commands for each device and ignore
   * invalid ones, so this approach provides maximum compatibility.
   */
  transformCommands(commands) {
    const tuyaCommands = [];

    if (commands.power !== undefined) {
      // Try common power command codes used by different device types
      tuyaCommands.push({
        code: 'switch_led',
        value: commands.power,
      });
      tuyaCommands.push({
        code: 'switch',
        value: commands.power,
      });
      tuyaCommands.push({
        code: 'switch_1',
        value: commands.power,
      });
    }

    if (commands.brightness !== undefined) {
      tuyaCommands.push({
        code: 'bright_value',
        value: commands.brightness,
      });
      tuyaCommands.push({
        code: 'brightness',
        value: commands.brightness,
      });
    }

    if (commands.temperature !== undefined) {
      tuyaCommands.push({
        code: 'temp_set',
        value: commands.temperature,
      });
      tuyaCommands.push({
        code: 'temperature',
        value: commands.temperature,
      });
    }

    return tuyaCommands;
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    if (!this.isConnected()) {
      return false;
    }

    try {
      // Use a lightweight endpoint to test connection with minimal data transfer
      const response = await this.context.request({
        method: 'GET',
        path: '/v1.0/devices',
        query: {
          page_no: 1,
          page_size: 1
        }
      });

      return response.success === true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new TuyaService();
