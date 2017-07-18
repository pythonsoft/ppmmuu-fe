import axios from 'axios';
const api = {};

api.upload = function upload(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/upload', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

module.exports = api;
