import React from 'react';
import { render } from 'react-dom';

import * as Layer from 'layer-websdk';
import * as LayerUI from 'layer-ui-web';
// import '../layer-sound-button/layer-sound-button.js';

import configureStore from './store/configureStore';
import { ownerSet } from './actions/messenger';
import ChatView from './ChatView'

let appId = window.layerSample.appId;

/**
 * Initialize Layer Client with `appId`
 */
let client = new Layer.Client({
  appId: window.layerSample.appId
});

/**
 * Client authentication challenge.
 * Sign in to Layer sample identity provider service.
 */
client.on('challenge', e => {
  window.layerSample.getIdentityToken(e.nonce, e.callback);
});

window.layerSample.onLogin(() => {
  /**
   * Start authentication
   */
  client.connect();
});

/**
 * Share the client with the middleware layer
 */
const store = configureStore(client);

/**
 * validate that the sample data has been properly set up
 */
window.layerSample.validateSetup(client);
window.LayerUI = LayerUI;

render(
  <ChatView client={client} store={store} />,
  document.getElementById('root')
);
