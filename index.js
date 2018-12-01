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

      bluetoothManager.getOwnMacAddress((err, ownAddress) => {

        if (err) {
          console.log("Error while trying to get own bluetooth mac address: ");
          console.log(err);
          return;
        } else {
          console.log("Own bluetooth mac address is: " + ownAddress);

          const plugin = {
            name: 'bluetooth',
            create: () => {
    
              return makeMultiservPlugin({
                bluetoothManager: bluetoothManager,
                macAddress: ownAddress
              })
            }
          }
  
          stack.multiserver.transport(plugin);
        }
      });
    
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
          makeDeviceDiscoverable: (forTime, cb) => {
            bluetoothManager.makeDeviceDiscoverable(forTime, cb);
          },
          isEnabled: (cb) => {
            bluetoothManager.isEnabled(cb);
          },
          getOwnMacAddress: (cb) => {
            bluetoothManager.getOwnMacAddress(cb);
          }

        }
      },
      manifest: {
        "nearbyDevices": "source",
        "makeDeviceDiscoverable": "async",
        "isEnabled": "async",
        "getOwnMacAddress": "async"
      }

    }
}