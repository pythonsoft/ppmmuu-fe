/**
 * Created by chaoningxie on 2016/12/10.
 */
const utils = require('./utils');
const clientConnect = require('socket.io-client');
const socketStreamClient = require('socket.io-stream');
const crypto = require('crypto');
const stream = require('stream');
const uuid = require('uuid');

const TransferTask = require('./transferTask');

const config = require('../global');

class FileClient {
  constructor(options) {
    this.settings = Object.assign({
      host: config.imHost,
      port: config.imPort,
      key: 'secret',
      userId: 'chaoningx',
      userName: 'chaoningx',
      isCrypto: false,
      file: '',
      concurrency: 0
    }, options);

    this.transferTaskInstance = null;
    this.isConnect = false;
    this.passedLength = 0;
    this.socket = null;
    this.stop = false;
    this._id = uuid.v1();
    this.status = 'create';
    const file = this.settings.file;
    this.name = file.name;
    this.size = file.size;
  }

  getFileInfo() {
    return {
      name: this.name,
      size: this.size
    };
  }

  getId() {
    return this._id;
  }

  transfer() {
    const me = this;

    //me.connectState();
    const ticket = utils.cipher(`${me.settings.userId}-${me.settings.isCrypto ? 1 : 0}`, me.settings.key);

    const socket = clientConnect(`http://${me.settings.host}:${me.settings.port}/file?im-ticket=${ticket}&im-key=ump`, {
      extraHeaders: {
        'im-ticket': ticket,
        'im-key': 'ump'
      }
    });

    this.socket = socket;

    socket.on('connect', () => {
      const file = me.settings.file;
      const task = new TransferTask({
        name: file.name,
        size: file.size,
        lastModifiedTime: file.lastModifiedDate.toLocaleDateString(),
        userId: me.settings.userId,
        userName: me.settings.userName,
        _id: me._id
      });
      task.socketId = socket.id;
      console.log('headerPackage===>', task.headerPackage);
      socket.emit('headerPackage', task.headerPackage, config.umpAssistQueueName);
      me.transferTaskInstance = task;
      me.isConnect = true;
    });

    socket.on('transfer_start', () => {
      me.sendPartOfFilePackage();
    });

    socket.on('transfer_package_success', (data) => {
      me.transferTaskInstance.setSuccessPackage(data._id);
    });

    socket.on('transfer_package_error', (data) => {
      me.transferTaskInstance.setFailPackage(data._id, data.error);
    });

    socket.on('transfer_package_finish', (data) => {
      me.sendPartOfFilePackage();
    });

    socket.on('invalid_request', (msg) => {
      console.log(`invalid_request socket id: ${me.getSocketId()}`, msg);
      this.status = 'error';
    });

    socket.on('complete', () => {
      console.log('file transfer complete');
      this.status = 'complete';
    });

    socket.on('error', (err) => {
      console.log(`error socket id: ${me.getSocketId()}`, err);
      this.status = 'error';
      me.destroy();
    });

    socket.on('disconnect', (msg) => {
      console.log(`disconnect with server${me.getSocketId()}`, msg);
      me.destroy();
    });
  }
  destroy() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.transferTaskInstance = null;
    this.settings = null;
  }
  stopTask() {
    this.stop = true;
    const pkg = this.transferTaskInstance.getPackage();
    this.socket.emit('stop', pkg.packageInfo, config.umpAssistQueueName);
  }
  restart() {
    this.stop = false;
    this.socket.emit('restart');
  }
  connectState() {
    const me = this;
    const fn = function (count) {
      console.log(`正在连接服务器(${me.settings.host}:${me.settings.port})...${count}`);
      if (!me.isConnect) {
        setTimeout(() => {
          fn(count + 1);
        }, 1000);
      } else {
        console.log('已经连上...');
      }
    };

    fn(1);
  }

  getSocketId() {
    return this.transferTaskInstance ? this.transferTaskInstance.socketId : '';
  }

  showProcess() {
    if (this.status === 'complete') {
      return '100';
    }
    const me = this;
    const totalSize = this.size;
    const percent = `${Math.ceil((me.passedLength / totalSize) * 100)}`;
    return percent;
  }

  sendPartOfFilePackage() {
    let hasTask = true;
    const me = this;

    const createTask = function (index) {
      if (!hasTask) { return false; }
      const pkg = me.transferTaskInstance.getPackage();

      if (pkg === 'done') {
        hasTask = false;
        console.log('transfer complete');
      } else if (pkg && !me.stop) {
        if (index < me.settings.concurrency) {
          createTask(index + 1);
        }

        const file = me.settings.file;
        console.log('start==>', pkg.packageInfo);
        const blob = file.slice(pkg.packageInfo.start, pkg.packageInfo.end);
        const reader = new FileReader();

        reader.onerror = function (e) { // 读取失败的时候重新执行一次
          console.log(e);
        };

        reader.readAsArrayBuffer(blob);
        reader.onload = function () {
          const buffer = reader.result;
          const rs = new stream.Readable();
          const rStream = socketStreamClient.createStream();
          rs.push(new Uint8Array(buffer));
          rs.push(null);
          if (me.settings.isCrypto) {
            const cipher = crypto.createCipher('aes192', me.settings.key);
            rs.pipe(cipher).pipe(rStream);
          } else {
            rs.pipe(rStream);
          }
          me.passedLength += pkg.packageInfo.size;
          console.log('send package===>');
          socketStreamClient(me.socket).emit('fileStream', rStream, pkg.packageInfo, config.umpAssistQueueName);
        };
      } else {
        hasTask = false;
        // utils.console('all the task is running');
      }
    };

    createTask(0);
  }
}

module.exports = FileClient;
