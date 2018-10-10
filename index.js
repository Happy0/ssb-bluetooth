const makeMultiservPlugin = require('multiserver-bluetooth');

/**
 * A plugin for bluetooth functionality. Initialises a multiserve plugin
 * for managing connections, and exposes some mux-rpc functions for bluetooth
 * functionality (such as scanning for nearby devices, making your device discoverable)
 * 
 * @param {*} bluetoothManager an instance of a bluetooth manager that implements the platform
 *                             specific (e.g. android or PC) bluetooth functionality.
 */
module.exports = (bluetoothManager) => {

    function initMultiservePlugin(stack) {
      const plugin = {
        name: 'bluetooth',
        create: () => {
          return makeMultiservPlugin({
            bluetoothManager: bluetoothManager
          })
        }
      }
    
      stack.multiserver.transport(plugin);
    }

    return {
      name: "bluetooth",
      version: "1.0.0",
      init: (stack) => {
        initMultiservePlugin(stack);

        return {
          nearbyDevices: (refreshInterval, cb) => {
            return bluetoothManager.nearbyDevices(refreshInterval);
          },
          makeDeviceDiscoverable: (forTime, cb) => {
            bluetoothManager.makeDeviceDiscoverable(forTime, cb);
          },

        }
      },
      manifest: {
        "refreshNearbyDevices": "async",
        "nearbyDevices": "source",
        "makeDeviceDiscoverable": "async"
      }

    }
}