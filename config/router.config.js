import Title from "antd/lib/skeleton/Title";

export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/moduleName',
        name: 'moduleName',
        routes: [{ path: '/moduleName/demo', component: './Demo' }],
      },
      {
        path: '/strategy',
        name: '经营策略',
        routes: [
          {
            path: "/strategy/StrategyBillModule",
            component: "./StrategyBillModule",
            title:  "经营策略模块",
          },
          {
            path: "/strategy/StrategyProjectLevel",
            component: "./StrategyProjectLevel",
            title:  "经营策略项目级别",
          },
          {
            path: "/strategy/StrategyProjectStyle",
            component: "./StrategyProjectStyle",
            title:  "经营策略项目类型",
          },
          {
            path: "/strategy/StrategyProjectScheme",
            component: "./StrategyProjectScheme",
            title:  "经营策略项目计划",
          },
          {
            path: "/strategy/StrategyProjectVerify",
            component: "./StrategyProjectVerify",
            title:  "经营策略验证问题",
          },
          {
            path: "/strategy/StrategyUser",
            component: "./StrategyUser",
            title:  "经营策略人员信息",
          },
          {
            path: "/strategy/StrategyAnalyzeBill",
            component: "./StrategyAnalyzeBill",
            title:  "经营策略管理",
          },
          // {
          //   path: "/strategy/StrategyAnalyzeBill",
          //   component: "./StrategyAnalyzeBill",
          //   title:  "经营策略分析落地",
          // },
          {
            path: "/strategy/StrategyHeader",
            component: "./StrategyHeader",
            title:  "经营策略分析落地2",
          },
        ]
      }
    ],
  },
];
