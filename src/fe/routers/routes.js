// import Root from './root';
import Menu from './menu';

const Management = resolve => require.ensure([], () => resolve(require('./management/index')), 'management');
const Role = resolve => require.ensure([], () => resolve(require('./management/role/index')), 'role');
const Permission = resolve => require.ensure([], () => resolve(require('./management/permission/index')), 'permission');
const Configuration = resolve => require.ensure([], () => resolve(require('./management/configuration/index')), 'configuration');
const Engine = resolve => require.ensure([], () => resolve(require('./management/engine/index')), 'engine');

const PersonalCenter = resolve => require.ensure([], () => resolve(require('./personalCenter/index')), 'personalCenter');
const Information = resolve => require.ensure([], () => resolve(require('./personalCenter/information/index')), 'information');
const ChangePassword = resolve => require.ensure([], () => resolve(require('./personalCenter/changePassword/index')), 'changePassword');
const Feedback = resolve => require.ensure([], () => resolve(require('./personalCenter/feedback/index')), 'feedback');
const Account = resolve => require.ensure([], () => resolve(require('./management/account')), 'account');

const MediaCenter = resolve => require.ensure([], () => resolve(require('./mediaCenter/index')), 'mediaCenter');

const Root = {
  template: '<router-view></router-view>'
};

export default [{
  path: '/',
  redirect: '/management',
  components: {
    default: Root,
    menu: Menu
  },
  meta: { title: 'UMP' },
  children: [
    {
      path: 'management',
      component: Management,
      meta: { title: '管理' },
      children: [
        { path: 'account', component: Account, meta: { title: '账户' } },
        { path: 'role', component: Role, meta: { title: '角色' } },
        { path: 'permission', component: Permission, meta: { title: '权限' } },
        { path: 'engine', component: Engine, meta: { title: '引擎管理' } },
        { path: 'configuration', component: Configuration, meta: { title: '设置' } }
      ]
    },
    {
      path: 'personalCenter',
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
    }
  ]
}];
