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
const Download = resolve => require.ensure([], () => resolve(require('./management/task/download/index')), 'download');

const ManagementAbout = resolve => require.ensure([], () => resolve(require('./management/help/about/index')), 'managementAbout');
const ManagementFeedback = resolve => require.ensure([], () => resolve(require('./management/help/feedback/index')), 'managementFeedback');

const PersonalCenter = resolve => require.ensure([], () => resolve(require('./personalCenter/index')), 'personalCenter');
const Information = resolve => require.ensure([], () => resolve(require('./personalCenter/information/index')), 'information');
const ChangePassword = resolve => require.ensure([], () => resolve(require('./personalCenter/changePassword/index')), 'changePassword');
const History = resolve => require.ensure([], () => resolve(require('./personalCenter/history')), 'history');
const Watch = resolve => require.ensure([], () => resolve(require('./personalCenter/watch')), 'watch');
const SearchHistory = resolve => require.ensure([], () => resolve(require('./personalCenter/searchHistory')), 'searchHistory');
const Feedback = resolve => require.ensure([], () => resolve(require('./personalCenter/feedback/index')), 'feedback');
const Account = resolve => require.ensure([], () => resolve(require('./management/account')), 'account');

const MediaCenter = resolve => require.ensure([], () => resolve(require('./mediaCenter/index')), 'mediaCenter');
const MovieEditor = resolve => require.ensure([], () => resolve(require('./movieEditor')), 'movieEditor');
const Catalog = resolve => require.ensure([], () => resolve(require('./library/catalog')), 'catalog');

const TaskCenter = resolve => require.ensure([], () => resolve(require('./taskCenter/index')), 'taskCenter');
const TaskDownload = resolve => require.ensure([], () => resolve(require('./taskCenter/download/index')), 'taskDownload');

const DownloadTemplate = resolve => require.ensure([], () => resolve(require('./management/template/download/index')), 'DownloadTemplate');
const TranscodeTemplate = resolve => require.ensure([], () => resolve(require('./management/template/transcode/index')), 'TranscodeTemplate');


const Shelf = resolve => require.ensure([], () => resolve(require('./shelves/index')), 'Shelf');
const PrepareDepartmentShelf = resolve => require.ensure([], () => resolve(require('./shelves/prepareDepartmentShelf/index')), 'PrepareDepartmentShelf');
const AllDepartmentShelf = resolve => require.ensure([], () => resolve(require('./shelves/allDepartmentShelf/index')), 'AllDepartmentShelf');
const DoingMyShelf = resolve => require.ensure([], () => resolve(require('./shelves/doingMyShelf/index')), 'DoingMyShelf');
const SubmittedMyShelf = resolve => require.ensure([], () => resolve(require('./shelves/submittedMyShelf/index')), 'SubmittedMyShelf');
const DeletedMyShelf = resolve => require.ensure([], () => resolve(require('./shelves/deletedMyShelf/index')), 'DeletedMyShelf');
const AllMyShelf = resolve => require.ensure([], () => resolve(require('./shelves/allMyShelf/index')), 'AllMyShelf');
const PrepareLineShelf = resolve => require.ensure([], () => resolve(require('./shelves/prepareLineShelf/index')), 'PrepareLineShelf');
const OnlineShelf = resolve => require.ensure([], () => resolve(require('./shelves/onlineShelf/index')), 'OnlineShelf');
const OfflineShelf = resolve => require.ensure([], () => resolve(require('./shelves/offlineShelf/index')), 'OfflineShelf');

const Library = resolve => require.ensure([], () => resolve(require('./library/index')), 'library');
const DepartmentCatalogTask = resolve => require.ensure([], () => resolve(require('./library/departmentCatalogTask')), 'library');
const PersonalCatalogTask = resolve => require.ensure([], () => resolve(require('./library/personalCatalogTask')), 'library');

const SubscribeInfo = resolve => require.ensure([], () => resolve(require('./management/subscribeManagement/subscribeInfo')), 'SubscribeInfo');
const SubscribeType = resolve => require.ensure([], () => resolve(require('./management/subscribeManagement/subscribeType')), 'SubscribeType');

const AuditDownload = resolve => require.ensure([], () => resolve(require('./management/audit/download')), 'auditManager');
const AuditEmpower = resolve => require.ensure([], () => resolve(require('./management/audit/empower')), 'auditEmpower');

export default [{
  path: '/',
  component: Home,
  name: 'home',
  children: [
    {
      path: 'management',
      redirect: 'management/account',
      component: Management,
      name: 'management',
      meta: { title: '管理' },
      children: [
        { path: 'account', component: Account, meta: { title: '账户' }, name: 'account' },
        { path: 'role', component: Role, meta: { title: '角色' }, name: 'role' },
        { path: 'permission', component: Permission, meta: { title: '权限' }, name: 'permission' },
        { path: 'engine', component: Engine, meta: { title: '引擎管理' }, name: 'engine' },
        { path: 'bucket', component: Bucket, meta: { title: '存储区' }, name: 'bucket' },
        { path: 'storagePath', component: StoragePath, meta: { title: '路径' }, name: 'storagePath' },
        { path: 'storageTactics', component: StorageTactics, meta: { title: '策略' }, name: 'storageTactics' },
        { path: 'transcode', component: Transcode, meta: { title: '转码任务' }, name: 'transcode' },
        { path: 'download', component: Download, meta: { title: '下载任务' }, name: 'download' },
        { path: 'configuration', component: Configuration, meta: { title: '设置' }, name: 'configuration' },
        { path: 'managementAbout', component: ManagementAbout, meta: { title: '关于' }, name: 'managementAbout' },
        { path: 'managementFeedback', component: ManagementFeedback, meta: { title: '报告问题' }, name: 'managementFeedback' },
        { path: 'downloadTemplate', component: DownloadTemplate, meta: { title: '下载模板' }, name: 'downloadTemplate' },
        { path: 'transcodeTemplate', component: TranscodeTemplate, meta: { title: '转码模板' }, name: 'transcodeTemplate' },
        { path: 'subscribeInfo', component: SubscribeInfo, meta: { title: '订阅信息' }, name: 'subscribeInfo' },
        { path: 'subscribeType', component: SubscribeType, meta: { title: '类型管理' }, name: 'subscribeType' },
        { path: 'auditDownload', component: AuditDownload, meta: { title: '下载审核' }, name: 'auditDownload' },
        { path: 'auditEmpower', component: AuditEmpower, meta: { title: '下载审核' }, name: 'auditEmpower' },
      ]
    },
    {
      path: 'personalCenter',
      redirect: 'personalCenter/information',
      component: PersonalCenter,
      meta: { title: '个人中心' },
      name: 'personalCenter',
      children: [
        { path: 'information', component: Information, meta: { title: '个人信息' }, name: 'information' },
        { path: 'changePassword', component: ChangePassword, meta: { title: '密码修改' }, name: 'changePassword' },
        { path: 'history',
          component: History,
          meta: { title: '观看历史' },
          name: 'history',
          children: [
            { path: 'watch/:objectId', component: Watch, name: 'historyWatch' }
          ] },
        { path: 'searchHistory', component: SearchHistory, meta: { title: '检索历史' }, name: 'searchHistory' },
        { path: 'feedback', component: Feedback, meta: { title: '意见反馈' }, name: 'feedback' }
      ]
    },
    {
      path: 'shelf',
      redirect: 'shelf/prepareDepartmentShelf',
      component: Shelf,
      meta: { title: '上架' },
      children: [
        {
          path: 'prepareDepartmentShelf',
          component: PrepareDepartmentShelf,
          meta: { title: '待认领' },
          name: 'prepareDepartmentShelf'
        },
        { path: 'allDepartmentShelf', component: AllDepartmentShelf, meta: { title: '全部' }, name: 'allDepartmentShelf' },
        { path: 'doingMyShelf', component: DoingMyShelf, meta: { title: '处理中' }, name: 'doingMyShelf' },
        { path: 'submittedMyShelf', component: SubmittedMyShelf, meta: { title: '已提交' }, name: 'submittedMyShelf' },
        { path: 'deletedMyShelf', component: DeletedMyShelf, meta: { title: '已删除' }, name: 'deletedMyShelf' },
        { path: 'allMyShelf', component: AllMyShelf, meta: { title: '全部' }, name: 'allMyShelf' },
        { path: 'prepareLineShelf', component: PrepareLineShelf, meta: { title: '待上架' }, name: 'prepareLineShelf' },
        { path: 'onlineShelf', component: OnlineShelf, meta: { title: '已上架' }, name: 'onlineShelf' },
        { path: 'offlineShelf', component: OfflineShelf, meta: { title: '下架' }, name: 'offlineShelf' }
      ],
      name: 'shelf'
    },
    {
      path: 'library',
      redirect: 'library/department_catalog_task_unassigned',
      component: Library,
      meta: { title: '入库' },
      children: [
        { path: 'department_catalog_task_unassigned', component: DepartmentCatalogTask, meta: { title: '待认领任务' }, name: 'department_catalog_task_unassigned' },
        { path: 'department_catalog_task_all', component: DepartmentCatalogTask, meta: { title: '全部任务' }, name: 'department_catalog_task_all' },
        { path: 'personal_catalog_task_all', component: PersonalCatalogTask, meta: { title: '全部任务' }, name: 'personal_catalog_task_all' },
        { path: 'personal_catalog_task_doing', component: PersonalCatalogTask, meta: { title: '编目中' }, name: 'personal_catalog_task_doing' },
        { path: 'personal_catalog_task_submitted', component: PersonalCatalogTask, meta: { title: '已提交' }, name: 'personal_catalog_task_submitted' },
        { path: 'personal_catalog_task_deleted', component: PersonalCatalogTask, meta: { title: '已删除' }, name: 'personal_catalog_task_deleted' },
        { path: 'catalog/:objectId/:taskId', component: Catalog, name: 'catalog', meta: { title: '编目' } }
      ],
      name: 'library'
    },
    {
      path: 'mediaCenter',
      component: MediaCenter,
      meta: { title: '媒体库' },
      children: [],
      name: 'mediaCenter'
    },
    {
      path: 'movieEditor/:objectId?',
      component: MovieEditor,
      name: 'movieEditor',
      meta: { title: '剪辑' }
    },
    {
      path: 'taskCenter',
      redirect: 'taskCenter/task_download_all',
      component: TaskCenter,
      name: 'taskCenter',
      meta: { title: '任务' },
      children: [
        { path: 'task_download_all', component: TaskDownload, meta: { title: '全部' }, name: 'task_download_all' },
        { path: 'task_download_complete', component: TaskDownload, meta: { title: '已完成' }, name: 'task_download_complete' },
        { path: 'task_download_error', component: TaskDownload, meta: { title: '错误' }, name: 'task_download_error' }
      ]
    }
  ]
}, {
  path: '/login',
  component: Login,
  name: 'login',
  meta: { title: '登录' }
}
];
