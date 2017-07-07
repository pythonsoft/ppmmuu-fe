# UMP-FE

## 项目目录

```
.
├── build                                       // 项目构建相关代码
│   ├── build.js                                // 生产环境构建
│   ├── dev-client.js                           // hotClient相关配置
│   ├── dev-server.js                           // 开发环境构建
│   ├── webpack.base.conf.js                    //
│   ├── webpack.dev.conf.js                     //
│   ├── webpack.prod.conf.js                    //
│   └── webpack.test.conf.js                    //
├── src                                         // 源码目录
│   └── fe                                      //
│       ├── app.js                                  // 页面入口
│       ├── common                                  // 共用方法
│       ├── component                               // 组件
│       ├── css                                     // 基础样式
│       ├── html                                    // 页面html
│       ├── img                                     // 公共图片
│       ├── lib                                     // 引用js库
│       └── routers
│           ├── page                                // 路由文件夹
│           │   ├── index.vue
│           │   └── subPage                         // 子路由文件夹
│           │       └── index.vue
│           ├── ...
│           ├── menu.vue                            // 一级导航菜单
│           └── routes.js                           // 路由配置
├── package.json                                // package文件
├── .gitignore                                  // gitignore
├── .eslintrc.js                                // eslint配置文件
├── index.html                                  //
.

```

# 项目依赖

- [vue](https://github.com/vuejs/vue)
- [vue-router](https://github.com/vuejs/vue-router)
- [axios](https://github.com/mzabriskie/axios)
