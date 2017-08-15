import Home from './home';

const Login = resolve => require.ensure([], () => resolve(require('./login/index')), 'login');
const Management = resolve => require.ensure([], () => resolve(require('./management/index')), 'management');
const Role = resolve => require.ensure([], () => resolve(require('./management/role/index')), 'role');
const Permission = resolve => require.ensure([], () => resolve(require('./management/permission/index')), 'permission');
const Configuration = resolve => require.ensure([], () => resolve(require('./management/configuration/index')), 'configuration');
const Engine = resolve => require.ensure([], () => resolve(require('./management/engine/index')), 'engine');
const Bucket = resolve => require.ensure([], () => resolve(require('./management/bucket/index')), 'bucket');
const StoragePath = resolve => require.ensure([], () => resolve(require('./management/storagePath/index')), 'storagePath');
const StorageTactics = resolve => require.ensure([], () => resolve(require('./management/storageTactics/index')), 'storageTactics');

const Transcode = resolve => require.ensure([], () => resolve(require('./management/task/transcode/index')), 'transcode');
const Transfer = resolve => require.ensure([], () => resolve(require('./management/task/transfer/index')), 'transfer');

const PersonalCenter = resolve => require.ensure([], () => resolve(require('./personalCenter/index')), 'personalCenter');
const Information = resolve => require.ensure([], () => resolve(require('./personalCenter/information/index')), 'information');
const ChangePassword = resolve => require.ensure([], () => resolve(require('./personalCenter/changePassword/index')), 'changePassword');
const Feedback = resolve => require.ensure([], () => resolve(require('./personalCenter/feedback/index')), 'feedback');
const Account = resolve => require.ensure([], () => resolve(require('./management/account')), 'account');

const MediaCenter = resolve => require.ensure([], () => resolve(require('./mediaCenter/index')), 'mediaCenter');

const TaskCenter = resolve => require.ensure([], () => resolve(require('./taskCenter/index')), 'taskCenter');
const TaskDownload = resolve => require.ensure([], () => resolve(require('./taskCenter/download/index')), 'taskDownload');

export default [{
  path: '/',
  redirect: '/mediaCenter',
  component: Home,
  children: [
    {
      path: 'management',
      redirect: 'management/account',
      component: Management,
      meta: { title: '管理' },
      children: [
        { path: 'account', component: Account, meta: { title: '账户' } },
        { path: 'role', component: Role, meta: { title: '角色' } },
        { path: 'permission', component: Permission, meta: { title: '权限' } },
        { path: 'engine', component: Engine, meta: { title: '引擎管理' } },
        { path: 'bucket', name: 'bucket', component: Bucket, meta: { title: '存储区' } },
        { path: 'storagePath', name: 'storagePath', component: StoragePath, meta: { title: '路径' } },
        { path: 'storageTactics', name: 'storageTactics', component: StorageTactics, meta: { title: '策略' } },
        { path: 'transcode', component: Transcode, meta: { title: '转码任务' } },
        { path: 'transfer', component: Transfer, meta: { title: '传输任务' } },
        { path: 'configuration', component: Configuration, meta: { title: '设置' } }
      ]
    },
    {
      path: 'personalCenter',
      redirect: 'personalCenter/information',
      component: PersonalCenter,
      meta: { title: '个人中心' },
      children: [
        { path: 'information', component: Information, meta: { title: '个人信息' } },
        { path: 'changePassword', component: ChangePassword, meta: { title: '密码修改' } },
        { path: 'feedback', component: Feedback, meta: { title: '意见反馈' } }
      ]
    },
    {
      path: 'mediaCenter',
      component: MediaCenter,
      meta: { title: '媒体库' },
      children: []
    },
    {
      path: 'taskCenter',
      redirect: 'taskCenter/taskDownload',
      component: TaskCenter,
      meta: { title: '任务' },
      children: [
        { path: 'taskDownload', component: TaskDownload, meta: { title: '下载任务' } }
      ]
    }
  ]
}, {
  path: '/login',
  component: Login,
  meta: { title: '登录' }
}
];
