import React, { Component } from 'react';
import { Icon, Menu, Layout } from 'antd';
import Link from 'umi/link';
import cls from 'classnames';
import { ScrollBar } from 'suid';
import styles from './index.less';

const { Header, Content } = Layout;
const { SubMenu } = Menu;

const menuData = [
  {
    id: '1',
    name: '本地登录',
    path: '/user/login',
  },
  {
    id: '10',
    name: 'moduleName',
    children: [
      {
        id: '100',
        name: 'menuName',
        path: '/moduleName/demo',
      },
    ],
  },
  {
    id: '20',
    name: '基础资料管理',
    children: [
      {
        id: '201',
        name: '项目类型配置',
        path: '/strategy/StrategyProjectStyle',
      },
      {
        id: '202',
        name: '项目分级配置',
        path: '/strategy/StrategyProjectLevel',
      },
      {
        id: '203',
        name: '所属模块配置',
        path: '/strategy/StrategyBillModule',
      },
      {
        id: '204',
        name: '人员配置',
        path: '/strategy/StrategyUser',
      },
      {
        id: '206',
        name: '验证问题配置',
        path: '/strategy/StrategyProjectVerify',
      },
      {
        id: '205',
        name: '项目周期配置',
        path: '/strategy/StrategyProjectScheme',
      },
    ],
  },
  {
    id: '30',
    name: '经营策略管理',
    children: [
      {
        id: '300',
        name: '经营策略管理',
        path: '/strategy/StrategyAnalyzeBill',
      },
      {
        id: '302',
        name: '经营分析落地',
        path: '/strategy/StrategyHeader',
      },
      {
        id: '303',
        name: '变更管理',
        path: '/strategy/StrategyProjectChange',
      },
    ]
  },
];

const getIcon = icon => {
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class Home extends Component {
  componentDidMount() {
    this.getNavMenuItems(menuData);
  }

  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  getSubMenuTitle = item => {
    const { name } = item;
    return item.icon ? (
      <span>
        {getIcon(item.icon)}
        <span>{name}</span>
      </span>
    ) : (
      name
    );
  };

  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu title={this.getSubMenuTitle(item)} key={item.id}>
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.id}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = item => {
    const { name } = item;
    const { location } = this.props;
    return (
      <Link to={item.path} replace={item.path === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  render() {
    return (
      <Layout className={cls(styles['main-box'])}>
        <Header className={cls('menu-header')}>应用路由列表</Header>
        <Content className={cls('menu-box')}>
          <ScrollBar>
            <Menu key="Menu" mode="inline" theme="light">
              {this.getNavMenuItems(menuData)}
            </Menu>
          </ScrollBar>
        </Content>
      </Layout>
    );
  }
}
