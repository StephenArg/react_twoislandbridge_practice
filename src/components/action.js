import {
    initService,
    subscribeStreamEvents,
    joinChannel,
    streamConfig,
    streamInit,
    manageAudio,
    manageVideo,
    streamClose,
  } from '../methods';
  
  /* ------------------------------------------------------------------------------------------------
      startPeer
  ------------------------------------------------------------------------------------------------ */
  
  // 'this' is the react component
  export function startPeer() {
  
    const { isMicOn, isVideoOn } = this.props;
    initService(this, 'peer')
    .then(() => subscribeStreamEvents(this))
    .then(() => joinChannel(this, 'peer'))
    .then(() => streamConfig(this, 'peer'))
    .then(() => streamInit(this, 'peer'))
    .then(() => manageAudio(this, isMicOn ? 'enable' : 'disable'))
    .then(() => manageVideo(this, isVideoOn ? 'enable' : 'disable'))
    .catch(console.log);
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      startScreen
  ------------------------------------------------------------------------------------------------ */
  
  // 'this' is the react component
  export function startScreen() {
  
    if (this.screenStartedCount === 0) {
      this.screenStartedCount++;
      initService(this, 'screen')
      .then(() => joinChannel(this, 'screen'))
      .then(() => streamConfig(this, 'screen'))
      .then(() => streamInit(this, 'screen'))
      .catch(this.props.onScreenShareDeny);
    }
  
  }
  
  /* ------------------------------------------------------------------------------------------------
      stopScreen
  ------------------------------------------------------------------------------------------------ */
  
  // 'this' is the react component
  export function stopScreen() {
  
    this.screenStartedCount = 0;
    this.removeStream(this.props.screenShareUID);
    streamClose(this, 'screen').catch(console.log);
  
  }