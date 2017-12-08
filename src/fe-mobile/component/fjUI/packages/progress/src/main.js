import Toast from '../../toast';

const Progress = {
  instance: null,
  start() {
    if (this.instance) { this.finish(); }
    this.instance = Toast.loading({ message: 'loading', duration: -1 });
  },
  finish() {
    this.instance.close();
  },
  fail() {
    this.instance.close();
  }
};

export default Progress;
