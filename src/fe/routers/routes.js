// import Root from './root';
import Menu from './menu';

const Management = resolve => require.ensure([], () => resolve(require('./management/index')), 'management');
// const SubPage1 = resolve => require.ensure([], () => resolve(require('./page1/sub/sub_index')), 'page1');
const Role = resolve => require.ensure([], () => resolve(require('./management/role/index')), 'role');
const Permission = resolve => require.ensure([], () => resolve(require('./management/permission/index')), 'permission');
const Configuration = resolve => require.ensure([], () => resolve(require('./management/configuration/index')), 'configuration');

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
  children: [{
    path: 'management',
    component: Management,
    meta: { title: '管理' },
    children: [
      { path: 'account', component: Role, meta: { title: '账户' } },
      { path: 'role', component: Role, meta: { title: '角色' } },
      { path: 'permission', component: Permission, meta: { title: '权限' } },
      { path: 'configuration', component: Configuration, meta: { title: '设置' } }
    ]
  }]
}];
