const makeMultiservPlugin = require('multiserver-bluetooth');

/**
 * A plugin for bluetooth functionality. Initialises a multiserve plugin
 * for managing connections, and exposes some mux-rpc functions for bluetooth
 * functionality (such as scanning for nearby devices, making your device discoverable)
 * 
 * @param {*} bluetoothManager an instance of a bluetooth manager that implements the platform
 *                             specific (e.g. android or PC) bluetooth functionality.
 *                             See ssb-mobile-bluetooth-manager for an example.
 */
module.exports = (bluetoothManager, opts) => {

    function initMultiservePlugin(stack) {
      const plugin = {
        name: 'bluetooth',
        create: () => {
          return makeMultiservPlugin({
            bluetoothManager: bluetoothManager,
            scope: opts ? opts.scope : null
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
          nearbyDevices: (refreshInterval) => {
            return bluetoothManager.nearbyDevices(refreshInterval);
          },
          nearbyScuttlebuttDevices: (refreshInterval) => {
            return bluetoothManager.nearbyScuttlebuttDevices(refreshInterval);
          },
          bluetoothScanState: () => {
            return bluetoothManager.bluetoothScanState();
          },
          makeDeviceDiscoverable: (forTime, cb) => {
            bluetoothManager.makeDeviceDiscoverable(forTime, cb);
          },
          isEnabled: (cb) => {
            bluetoothManager.isEnabled(cb);
          },
          getMetadataForDevice: (deviceAddress, cb) => {
            bluetoothManager.getMetadataForDevice(deviceAddress, cb);
          }

        }
      },
      manifest: {
        "nearbyDevices": "source",
        "nearbyScuttlebuttDevices": "source",
        "bluetoothScanState": "source",
        "makeDeviceDiscoverable": "async",
        "isEnabled": "async",
        "getMetadataForDevice": "async"
      }

    }
}