const makeBluetoothPlugin = require('multiserver-bluetooth');
const BluetoothManager = require('ssb-bluetooth-manager');

/**
 * A scuttlebot plugin for handling bluetooth connections
 */
module.exports = function bluetoothTransportPlugin(stack) {

  const bluetoothManager = BluetoothManager();

  const plugin = {
    name: 'bluetooth',
    create: () => {
      return makeBluetoothPlugin({
        bluetoothManager: bluetoothManager
      })
    }
  }

  stack.multiserver.transport(plugin);
}
