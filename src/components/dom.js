import _ from 'lodash';

/* ------------------------------------------------------------------------------------------------
    addStream
------------------------------------------------------------------------------------------------ */

const MAX_PEER_NUM = 3;

// 'this' is the react component
export function addStream(stream) {

  const { screenShareUID } = this.props;
  const repetition = this.state.streamList.some(item => item.getId() === stream.getId());

  if (!repetition) {
    const clonedStream = [ ...this.state.streamList ];
    const peerNum = _.reject(clonedStream, item => item.getId() === screenShareUID).length;
    if (peerNum < MAX_PEER_NUM) {
      this.updateState({
        streamList: [ ...clonedStream, stream ],
      });
    }
  }


}

/* ------------------------------------------------------------------------------------------------
    removeStream
------------------------------------------------------------------------------------------------ */

// 'this' is the react component
export function removeStream(uid) {

  this.state.streamList.map((item, index) => {
    if (item.getId() === uid) {
      item.close();
      let element = document.querySelector('#ag-item-' + uid);
      if (element) element.parentNode.removeChild(element);
      let clone = [ ...this.state.streamList ];
      clone.splice(index, 1);
      this.updateState({
        streamList: clone,
      });
    }
  });

}


/* ------------------------------------------------------------------------------------------------
    updateStream
------------------------------------------------------------------------------------------------ */

import { updateStreamStyle } from './updateStreamStyle';

const screenStyle = {
  width: '100%',
  height: '100%',
};


// 'self' is the react component
export const updateStream = self => {

  const {
    screenShareUID,
    videoNode_id,
    screenShareNode_id,
    peerStyle,
  } = self.props;

  const videoWrapper = document.getElementById(videoNode_id);
  const screenWrapper = document.getElementById(screenShareNode_id);

  self.state.streamList.map(item => {
    const id = item.getId();
    const node_id = `ag-item-${id}`;
    const mode = id === screenShareUID ? 'screen' : 'peer';
    const wrapper = mode === 'screen' ? screenWrapper : videoWrapper;
    const style = mode === 'screen' ? screenStyle : peerStyle;
    const findElement = document.getElementById(node_id);
    if (!findElement && item.play) {
      const newElement = document.createElement('section');
      newElement.setAttribute('id', node_id);
      wrapper.appendChild(newElement);
      updateStreamStyle(node_id, style);
      item.play(node_id);
    }
    if (item.player && item.player.resize) item.player.resize();
  });
};

/* ------------------------------------------------------------------------------------------------
    updateStreamStyle
------------------------------------------------------------------------------------------------ */

export const updateStreamStyle = (node_id, style) => {

  const element = document.getElementById(node_id);

  if (element) {
    _.forEach(style, (val, key) => {
      element.style[key] = val;
    });
  }


}