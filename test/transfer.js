const getPackage = function getPackage(str, opcode=0){
  let pack = new ArrayBuffer(5 + str.length);
  const message = stringToArrayBuffer(str);
  const messageArr = new Uint8Array(message);
  const dv = new Uint8Array(pack);
  dv[0] = opcode;
  dv[1] = str.length & 0xff;
  dv[2] = (str.length & 0xff00) >> 8;
  dv[3] = (str.length & 0xff0000) >> 16;
  dv[4] = (str.length & 0xff000000) >> 24;
  console.log(dv[0], dv[1], dv[2], dv[3],dv[4]);
  dv.set(messageArr, 5);
  return dv.buffer;
}

const getFilePackage = function getFilePackage(arr, opcode=0){
  let pack = new ArrayBuffer(5 + arr.byteLength);
  const message = arr;
  const messageArr = new Uint8Array(message);
  const length = arr.byteLength;
  const dv = new Uint8Array(pack);
  dv[0] = opcode;
  dv[1] = length & 0xff;
  dv[2] = (length & 0xff00) >> 8;
  dv[3] = (length & 0xff0000) >> 16;
  dv[4] = (length & 0xff000000) >> 24;
  console.log(dv[0], dv[1], dv[2], dv[3],dv[4]);
  dv.set(messageArr, 5);
  return dv.buffer;
}

const getPayLoad = function getPayLoad(payload, options){
  return JSON.stringify(Object.assign(payload, options));
}

const stringToArrayBuffer = function stringToArrayBuffer(str){
  if(/[\u0080-\uffff]/.test(str)){
    throw new Error("this needs encoding, like UTF-8");
  }
  var arr = new Uint8Array(str.length);
  for(var i=str.length; i--; )
    arr[i] = str.charCodeAt(i);
  return arr.buffer;
}

const arrayBufferToString = function arrayBufferToString(buffer){
  var arr = new Uint8Array(buffer);
  if (!("TextDecoder" in window))
    alert("Sorry, this browser does not support TextDecoder...");

  var enc = new TextDecoder();
  var str = enc.decode(arr);
  if(/[\u0080-\uffff]/.test(str)){
    throw new Error("this string seems to contain (still encoded) multibytes");
  }
  console.log("receive str==>", str);
  return str;
}

const uint8ArrayToString = function uint8ArrayToString(arr){
  if (!("TextDecoder" in window))
    alert("Sorry, this browser does not support TextDecoder...");

  var enc = new TextDecoder();
  var str = enc.decode(arr);
  if(/[\u0080-\uffff]/.test(str)){
    throw new Error("this string seems to contain (still encoded) multibytes");
  }
  return str;
}

const formatSize = function (size, isNeedUnit) {
  let str = '';
  let unit = 'B';
  if (size < 1000) {
    str = size;
  } else if (size < 1000 * 1000) {
    str = Math.round(100 * (size / 1024)) / 100;
    unit = 'KB';
  } else if (size < 1000 * 1000 * 1000) {
    str = Math.round(100 * (size / (1024 * 1024))) / 100;
    unit = 'MB';
  } else {
    str = Math.round(100 * (size / (1024 * 1024 * 1024))) / 100;
    unit = 'GB';
  }
  return isNeedUnit ? { size: str, unit } : (`${str} ${unit}`);
};

const CONFIG_STATUS = {
  STATUS_CONNECTING:  '1',
  STATUS_CONNECTED:   '2',
  STATUS_START:       '19',
  STATUS_STARTED:     '20',
  STATUS_TRANSFERING: '3',
  STATUS_TRANSFERED:  '4',
  STATUS_STOPING:     '6',
  STATUS_STOPED:      '7',
  STATUS_CANCELING:   '8',
  STATUS_CANCELED:    '9',
  STATUS_FAIL:        '5',
  STATUS_RETRANSFER:  '11',
  STATUS_EXIT:        '13',
  STATUS_BEATING:     '18'

};

class Transfer {
  constructor(options){
    this.settings = Object.assign({
      host: '10.0.15.59',
      port: '9000',
      file: '',
      uuid: '1',
      ticket: ''
    }, options);
    this.status = '';
    this.control = false;
    const file = this.settings.file;
    const uuid = this.settings.uuid;
    let fileSize = file.size;
    this.file = file;
    this.fileSize = fileSize;
    this.stopped = false;
    this.speed = 0;
    this.status = 'created';
    this.sendFileInterval = '';
    this.sendFileTimeout = 10;
    this.beatInterval = '';
    this.beatTimeout = 1000;
    this.transfered = 0;
    this.uuid = '' + uuid;
    this.payload = {
      "protocol": "0",
      "type": "0",
      "mode": "0",
      "encrypt": "0",
      "speed": "0",
      "transfered": "0",
      "total": '' + fileSize,
      "status": "0",
      "uuid": this.uuid,
      "ip": "10.0.14.57",
      "port": "36201",
      "log": "none",
      "reserve": "none",
    }
    this.initSocket();
    this.prepareTransferSend = this.prepareTransferSend.bind(this);
    this.sendFile = this.sendFile.bind(this);
    this.clearAllInterval = this.clearAllInterval.bind(this);
  }
  initSocket() {
    this.socket = new WebSocket(`ws://${this.settings.host}:${this.settings.port}/?Uuid=${this.uuid}`);
    this.socket.binaryType = "arraybuffer";
    const me = this;

    this.socket.onopen = function(){
      me.onopen();
    };
    this.socket.onmessage = function(msg){
      me.onmessage(msg);
    }

    this.socket.onerror = function(e){
      console.log("error===>", e);
      me.clearAllInterval();
    }

    this.socket.onclose = function(){
      console.log("server closed===>");
      me.clearAllInterval();
    }
  }
  clearAllInterval(){
    this.stopped = true;
    if(this.sendFileInterval){
      clearInterval(this.sendFileInterval);
    }
    if(this.beatInterval){
      clearInterval(this.beatInterval);
    }
  }
  onopen(){
    console.log('connect success');
    this.prepareTransferSend(CONFIG_STATUS.STATUS_CONNECTING);
    this.countSpeed();
  }
  onmessage(msg){
    console.log("msg", msg);
    const buffer = msg.data;
    var msgBuffer = '';
    let payload = {};
    var dv = new DataView(msg.data);
    var optcode = dv.getUint8(0);
    var length = dv.getUint32(1, true);
    console.log("buffer length==>", buffer.byteLength);
    if(buffer.byteLength > 5){
      msgBuffer = buffer.slice(5, length + 5);
      payload = JSON.parse(arrayBufferToString(msgBuffer));
    }
    const status = payload.status;
    //this.transfered = payload.transfered * 1;
    console.log("receive status==>", status);
    switch(status){
      case CONFIG_STATUS.STATUS_CONNECTED:
        console.log("send start==>");
        this.status = 'connected';
        this.prepareTransferSend(CONFIG_STATUS.STATUS_START);
        if(this.control){
          this.control = false;
        }
        break;
      case CONFIG_STATUS.STATUS_STARTED:
        console.log(" start set intval ==>");
        this.stopped = false;
        this.sendFile();
        //this.sendFileInterval = setInterval(this.sendFile, this.sendFileTimeout);
        this.beatInterval = setInterval(this.prepareTransferSend, this.beatTimeout, CONFIG_STATUS.STATUS_BEATING);
        break;
      case CONFIG_STATUS.STATUS_TRANSFERING:
        this.status = 'transfer';
        if(payload.transfered * 1 >= this.fileSize){
          console.log("send stopping");
          this.prepareTransferSend(CONFIG_STATUS.STATUS_STOPING);
          this.clearAllInterval();
          this.status = 'completed';
        }
        break;
      case CONFIG_STATUS.STATUS_TRANSFERED:
        console.log("server says: transfered");
        this.status = 'completed';
        this.clearAllInterval();
        break;
      case CONFIG_STATUS.STATUS_RETRANSFER:
        console.log(" restart set intval ==>");
        this.stopped = false;
        this.sendFile();
        //this.sendFileInterval = setInterval(this.sendFile, this.sendFileTimeout);
        this.beatInterval = setInterval(this.prepareTransferSend, this.beatTimeout, CONFIG_STATUS.STATUS_BEATING);
        break;
      case CONFIG_STATUS.STATUS_STOPING:
        this.status = 'stopping';
        console.log("server say stopping, and client send stopped!");
        this.prepareTransferSend(CONFIG_STATUS.STATUS_STOPED);
        break;
      case CONFIG_STATUS.STATUS_STOPED:
        this.status = 'stopped';
        console.log("server say stopped!");
        if(this.control){
          this.control = false;
        }
        this.clearAllInterval();
        break;
      case CONFIG_STATUS.STATUS_CANCELED:
        this.clearAllInterval();
        break;
    }
  }
  destroy() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  getStatus(){
    return this.status;
  }
  getUuid() {
    return this.uuid;
  }
  getFileInfo() {
    return {
      name: this.file.name,
      size: this.file.size
    };
  }
  canStop(){
    if(this.socket && (this.status !== 'stopped' &&  this.status !== 'completed' && this.status !== 'stopping')){
      return true;
    }
  }
  canStart(){
    if(this.status === 'stopped'){
      return true;
    }
  }
  stopTask(){
    this.stopped = true;
    this.status = 'stopping';
    console.log("pause send stopping");
    this.prepareTransferSend(CONFIG_STATUS.STATUS_STOPING);
  }
  start(){
    this.control = true;
    console.log("starting");
    this.status = 'created';
    if(this.stopped){
      this.stopped = false;
      this.initSocket();
    }
  }

  getProcess() {
    if (this.status === 'completed') {
      return '100';
    }
    const me = this;
    const totalSize = this.size;
    const percent = `${Math.ceil((me.passedLength / totalSize) * 100)}`;
    return percent;
  }
  getSpeed() {
    return this.speed;
  }
  countSpeed() {
    const me = this;
    const interval = 2000;
    const totalSize = this.fileSize;
    let lastSize = 0;

    const show = function () {
      const percent = Math.ceil((me.transfered /totalSize) * 100);
      const averageSpeed = (me.transfered - lastSize) / interval * 1000;

      lastSize = me.transfered;
      me.speed = formatSize(averageSpeed) + '/s';
      console.log('speed==>', me.speed);

      if (me.transfered >= totalSize) {
        //console.log(`共用时：${(Date.now() - startTime) / 1000}秒`);
      } else {
        setTimeout(() => {
          show();
        }, interval);
      }
    };

    show();
  }
  prepareTransferSend(status){
    const options = {
      "transfered":"" + this.transfered,
      "status": status,
    }
    let message = getPayLoad(this.payload, options);
    let pac = getPackage(message, 0);
    console.log("send payload==>", message);
    this.socket.send(pac);
  }
  sendFile(){
    const file = this.file;
    let start = this.transfered;
    let leftLen = this.fileSize - start;
    if(leftLen <= 0){
      console.log("send completed!");
      return;
    }
    if(this.stopped){
      console.log('send file stopped');
      return;
    }
    let stop = leftLen > 256*1024 ? start + 256*1024 : start + leftLen;
    var blob = file.slice(start, stop);
    console.log("blob==>", typeof blob, blob);
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    const me = this;
    reader.onload = function(e){
      me.transfered += stop - start;
      let pac = getFilePackage(reader.result, 1);
      console.log("send file==>", pac);
      if(!me.stopped) {
        me.socket.send(pac);
        setTimeout(me.sendFile, me.sendFileTimeout);
      }
    }
    reader.onerror = function(e){  //读取失败的时候重新执行一次
      console.log("read file error==>", e);
      setTimeout(me.sendFile, me.sendFileTimeout);
    }
  }
}