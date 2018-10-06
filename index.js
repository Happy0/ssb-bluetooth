const bluetoothMsPlugin = require('multiserver-bluetooth');

module.exports = (bluetoothManager) => {

  function initMultiservPlugin(stack) {
    stack.multiserver.transport({
      name: 'bluetooth',
      create: () => bluetoothMsPlugin({bluetoothManager: bluetoothManager}),
    });
  }

  return {
    name: "bluetoothController",
    version: "1.0.0",
    init: (stack) => {

      initMultiservPlugin(stack);

      return {
        refreshNearbyDevices: (cb) => {

          bluetoothManager.refreshNearbyDevices();

          // TODO: error handling
          cb(null, true);
        },
        nearbyDevices: () => {
          return bluetoothManager.nearbyDevices();
        },
        makeDeviceDiscoverable: (forTime, cb) => {
          bluetoothManager.makeDeviceDiscoverable(forTime);

          // TODO: error handling
          cb(null, true);
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