/* ------------------------------------------------------------------------------------------------
    initService
------------------------------------------------------------------------------------------------ */

export function initService(self, mode) {

    const appId = process.env.WEBRTC_AGORA_APP_ID;
  
    self.AgoraRTC = window.AgoraRTC;
    self.AgoraRTC.Logger.setLogLevel(self.AgoraRTC.Logger.ERROR);
  
    const newClient = self.AgoraRTC.createClient({ mode: self.transcode });
    if (mode === 'screen') self.shareClient = newClient;
    if (mode === 'peer') self.client = newClient;
  
    return new Promise(resolve => {
      newClient.init(appId, () => {
        resolve('initService success');
      });
    });
  
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      joinChannel
  ------------------------------------------------------------------------------------------------ */
  
  export function joinChannel(self, mode) {
  
    const { peerUID, screenShareUID, meeting_id } = self.props;
    const appId = process.env.WEBRTC_AGORA_APP_ID;
    const client = mode === 'screen' ? self.shareClient : self.client;
  
    return new Promise(resolve => {
  
      client.join(
        appId,
        meeting_id, // channel
        mode === 'peer' ? peerUID : screenShareUID, // uid
        uid => {
          if (mode === 'screen') self.shareUid = uid;
          if (mode === 'peer') self.uid = uid;
          resolve('joinChannel success');
        },
      );
  
    });
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      manageAudio
  ------------------------------------------------------------------------------------------------ */
  
  export function manageAudio(self, option) {
  
    const { localStream } = self;
    if (!localStream) return;
  
    if (option === 'enable') {
      self.localStream.enableAudio();
    } else if (option === 'disable') {
      self.localStream.disableAudio();
    }
  
  }
  
  import { updateStreamStyle } from '../dom';
  
  /* ------------------------------------------------------------------------------------------------
      manageVideo
  ------------------------------------------------------------------------------------------------ */
  
  export function manageVideo(self, option) {
  
    const { localStream } = self;
    if (!localStream) return;
  
    const node_id = `ag-item-${self.uid}`;
  
    if (option === 'enable') {
      self.localStream.enableVideo();
      updateStreamStyle(node_id, { display: 'block' });
    } else if (option === 'disable') {
      self.localStream.disableVideo();
      updateStreamStyle(node_id, { display: 'none' });
    }
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      streamClose
  ------------------------------------------------------------------------------------------------ */
  
  export function streamClose(self, mode) {
  
    const client = mode === 'screen' ? self.shareClient : self.client;
    return new Promise((resolve, reject) => {
  
      if (client) {
        if (mode === 'peer' && self.localStream) {
          client.unpublish(self.localStream);
          self.localStream.close();
        }
        if (mode === 'screen' && self.shareStream) {
          client.unpublish(self.shareStream);
          self.shareStream.close();
        }
  
        client.leave(() => {
          resolve('Client succeed to leave.');
        }, () => {
          reject('Client failed to leave.');
        });
      }
  
    });
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      streamConfig
  ------------------------------------------------------------------------------------------------ */
  
  export function streamConfig(self, mode) {
  
    return new Promise(resolve => {
  
      if (mode === 'screen') {
        const stream = self.AgoraRTC.createStream({
          streamID: self.shareUid,
          video: false,
          audio: false,
          screen: true,
          // chrome
          extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg',
          /*
            for production use create a copy of the plugin in chrome extensions store
            and point it to your server in the manifest.json
            Example used in development tobe able to access local camera:
               "externally_connectable": {
                  "matches": [ "*://127.0.0.1/*" ]
               },
          */
          // firefox
          mediaSource: 'application' // 'screen', 'application', 'window'
        });
  
        stream.setVideoProfile(self.shareVideoProfile);
        self.shareStream = stream;
        resolve('streamConfig screen-share done');
  
      } else {
        // audio-video
        const stream = self.AgoraRTC.createStream({
          streamID: self.uid,
          video: true,
          audio: true,
          screen: false,
        });
  
        stream.setVideoProfile(self.videoProfile);
        self.localStream = stream;
        resolve('streamConfig audio-video done');
  
      }
  
    });
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      streamInit
  ------------------------------------------------------------------------------------------------ */
  
  export function streamInit(self, mode) {
  
    const client = mode === 'screen' ? self.shareClient : self.client;
    const stream = mode === 'screen' ? self.shareStream : self.localStream;
    return new Promise((resolve, reject) => {
  
      stream.init(() => {
        self.addStream(stream);
        client.publish(stream, err => {
          reject('Publish local stream error: ' + err);
        });
        resolve('streamInit success');
      }, error => {
        reject(error);
      });
  
    });
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      subscribeStreamEvents
  ------------------------------------------------------------------------------------------------ */
  
  export function subscribeStreamEvents(self) {
  
    self.client.on('stream-added', evt => {
      console.log('New stream added: ' + evt.stream.getId());
      self.client.subscribe(evt.stream, err => {
        console.log('Subscribe stream failed', err);
      });
    });
  
    self.client.on('peer-leave', evt => {
      console.log('Peer has left: ' + evt.uid);
      self.removeStream(evt.uid);
    });
  
    self.client.on('stream-subscribed', evt => {
      console.log('Got stream-subscribed: ' + evt.stream.getId());
      self.addStream(evt.stream);
    });
  
    self.client.on('stream-removed', evt => {
      console.log('Stream removed: ' + evt.stream.getId());
      self.removeStream(evt.stream.getId());
    });
  
  }