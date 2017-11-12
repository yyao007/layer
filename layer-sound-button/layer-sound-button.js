layerUI.registerComponent('layer-sound-button', {
    properties: {
        conversation: {
            set(value) {
                if (value) this.client = value.getClient();
            },
        },
    },
    methods: {
        // This method is called by the constructor
        onCreate: function() {
            // the nodes object is setup using the layer-id attribute
            this.state = {recording: false};
            this.chunks = [];
            this.record = document.querySelector('.record');
            this.record.addEventListener('click', this.onClick.bind(this));
            this.getUserMedia();
            console.log("connected");
        },

        getUserMedia: function() {
            navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
                            navigator.mediaDevices.webkitGetUserMedia ||
                            navigator.mediaDevices.mozGetUserMedia ||
                            navigator.mediaDevices.msGetUserMedia;
            if(navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({audio: true}, stream => {
                    this.recorder = new MediaRecorder(stream);
                    this.recorder.ondataavailable = e => {
                        this.chunks.push(e.data);
                    }
                    this.recorder.onstop = e => {
                        const blob = new Blob(this.chunks, {'type': 'audio/ogg'});
                        this.chunks = [];
                        const parts = [{
                            mimeType: 'audio/ogg',
                            body: blob
                        }]
                        const message = this.conversation ? this.conversation.createMessage({ parts }) : null;
                        console.log(message);
                        message.send();
                    }
                },
                err => {
                    console.log('The following gUM error occured: ' + err);
                });
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        },

        // Called when the user clicks the button
        onClick: function() {
            if (!this.state.recording) {
                recorder.start();
                console.log('Recording...')
                this.record.style.color = "red";
            } else {
                recorder.stop();
                console.log('stopped');
                this.record.style.color = "";
            }

            this.state.recording = !this.state.recording;
        },
    }
});
layerUI.registerTemplate('layer-sound-button');
