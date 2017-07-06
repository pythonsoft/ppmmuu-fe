// import Root from './root';
import Menu from './menu';

const Management = resolve => require.ensure([], () => resolve(require('./management/index')), 'management');
// const SubPage1 = resolve => require.ensure([], () => resolve(require('./page1/sub/sub_index')), 'page1');

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
      { path: 'account', component: Root, meta: { title: '账户' } }
    ]
  }]
}];
