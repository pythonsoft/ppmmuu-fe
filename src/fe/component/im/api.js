import bubble from '../higherOrder/bubble/index';
import { merge, isEmptyObject } from '../../common/utils';
import io from 'socket.io-client';

const global = require('../../global');

const api = {};

const chat = io(`ws://${global.baseDomain/chat}`,{
  "transports":['websocket', 'polling']
});

chat.on('connect', function(){
  console.log('a user connected');
});

module.exports = api;
