const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

var ssbKeys = require('ssb-keys');
var manifest = require('./manifest');

var BluetoothPlugin = require('../index');
const makeNoauthPlugin = require('multiserver/plugins/noauth');

const writablePath = path.join('/home/happy0/', '');
const ssbPath = path.resolve(writablePath, '.ssb');

var manifestFile = path.join(ssbPath, '/manifest.json')

if (!fs.existsSync(ssbPath)) {
  mkdirp.sync(ssbPath);
}

const keys = ssbKeys.loadOrCreateSync(path.join(ssbPath, '/secret'));

const config = require('ssb-config/inject')();
config.path = ssbPath;
config.keys = keys;
config.manifest = manifest;
config.friends.hops = 2;
config.connections = {
  incoming: {
    bluetooth: [{scope: 'public', transform: 'noauth'}],
    net: [{ port: 8008, scope: "private", "transform": "shs" }]
  },
  outgoing: {
    bluetooth: [{scope: 'public', transform: 'noauth'}],
  },
};

function noauthTransform(stack, cfg) {
  stack.multiserver.transform({
    name: 'noauth',
    create: () => {
      return makeNoauthPlugin({
        keys: {
          publicKey: Buffer.from(cfg.keys.public, 'base64'),
        },
      });
    },
  });
}

var server = require('scuttlebot/index')
  .use(noauthTransform)
  .use(BluetoothPlugin)
  .use(require('scuttlebot/plugins/plugins'))
  .use(require('scuttlebot/plugins/master'))
  .use(require('scuttlebot/plugins/gossip'))
  .use(require('scuttlebot/plugins/replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('ssb-query'))
  .use(require('ssb-links'))
  .use(require('ssb-ws'))
  .use(require('ssb-ebt'))
  .call(null, config);

fs.writeFileSync(manifestFile, JSON.stringify(server.getManifest(), null, 2))

console.log(server);

//console.log("Going to try to connect...")
//server.connect("bt:<bluetooth address>", (err, res) => {
//  console.log("Connection err: " + err);
//})
