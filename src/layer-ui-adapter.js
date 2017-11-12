import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import * as Layer from 'layer-websdk';
import * as LayerUI from 'layer-ui-web';

// initialize lauerUI with your appID and layer sdk
LayerUI.init({
  appId: window.layerSample.appId,
});

layerUI.registerTextHandler({
  name: 'layer-logo-replacer',
  order: 300,
  handler: function(textData) {
    textData.text = textData.text.replace(/\blayer\b/gi,
      ' <img src="https://cdn.layer.com/web/logo-black.svg" /> ');
  }
});

const MessageHandler = LayerUI.mixins.MessageHandler;

LayerUI.registerMessageComponent('layer-message-sound', {
  mixins: [MessageHandler],
  properties: {
    label: {
      value: "Sound Message"
    }
  },
  methods: {
    handlesMessage: function(message) {
        const soundParts = message.parts.filter(part =>
            ['audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp3'].indexOf(part.mimeType) !== -1
        ).length;
        return soundParts > 0;
    },
    onCreate: function() {
        this.rendered = false;
    },
    onRender: function() {

    },
    onRerender: function() {
        let part = this.properties.message.parts[0];
        if (part.body && !this.rendered) {
            this.rendered = true;
            let sound = URL.createObjectURL(part.body);
            let audio = document.createElement('audio');
            audio.controls = true;
            audio.src = sound;
            this.appendChild(audio);

        } else if (!this.rendered) {
            part.fetchContent();
        }
    },
    onSent: function() {

    }
  }
});


const LayerUIWidgets = LayerUI.adapters.react(React, ReactDom);
module.exports = LayerUIWidgets;
