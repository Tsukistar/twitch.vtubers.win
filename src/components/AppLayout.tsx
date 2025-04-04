/**
 * 应用布局组件
 * 用于管理应用的整体布局和导航栏
 */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import {
  IconTranslate,
  IconHome,
  IconDashboard,
  IconTool,
  IconFire,
} from '@arco-design/web-react/icon';
import '../styles/AppLayout.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login, logout } from '../store/authSlice';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // 使用 ref 引用菜单 DOM 元素
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageIconRef = useRef<SVGSVGElement>(null);
  const userIconRef = useRef<HTMLImageElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 检查点击是否在语言菜单或语言图标之外
      const isOutsideLanguageMenu =
        languageMenuRef.current &&
        !languageMenuRef.current.contains(target) &&
        languageIconRef.current &&
        !languageIconRef.current.contains(target);

      // 检查点击是否在用户菜单或用户头像之外
      const isOutsideUserMenu =
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        userIconRef.current &&
        !userIconRef.current.contains(target);

      // 如果点击在语言菜单和用户菜单之外，关闭所有菜单
      if (isOutsideLanguageMenu && isOutsideUserMenu) {
        setLanguageMenuVisible(false);
        setUserMenuVisible(false);
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('click', handleClickOutside);

    // 清理事件监听器
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 从 Redux 状态中读取登录状态和头像 URL
  const { isLoggedIn, accessToken, avatarUrl } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();

  const toggleLanguageMenu = () => {
    setLanguageMenuVisible(!languageMenuVisible);
    if (userMenuVisible) setUserMenuVisible(false);
  };

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible);
    if (languageMenuVisible) setLanguageMenuVisible(false);
  };

  // 模拟登录流程（实际中会跳转到 Twitch OAuth）
  const handleLogin = () => {
    // 模拟 Twitch API 返回的数据
    const mockAccessToken = 'mock-access-token';
    const mockAvatarUrl =
      'https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-5d2f-11e9-9e4f-0a4c4f2f1b67-profile_image-300x300.png';

    // 分发 login 动作
    dispatch(login({ accessToken: mockAccessToken, avatarUrl: mockAvatarUrl }));
  };

  // 模拟登出流程
  const handleLogout = () => {
    // 分发 logout 动作
    dispatch(logout());
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header className="layout-header">
        <div className="header-title">Tsukistar Twitch Tools</div>
        <div className="right-menu-items">
          <div className="right-menu-item">
            <IconTranslate
              ref={languageIconRef}
              style={{ fontSize: '30px', cursor: 'pointer' }}
              onClick={toggleLanguageMenu}
              className="menu-icon"
            />
            <div
              className={`dropdown-menu ${languageMenuVisible ? '' : 'dropdown-hidden'}`}
              ref={languageMenuRef}
            >
              <a href="#" className="dropdown-item">
                简体中文
              </a>
              <a href="#" className="dropdown-item">
                正體中文
              </a>
              <a href="#" className="dropdown-item">
                English
              </a>
              <a href="#" className="dropdown-item">
                日本語
              </a>
            </div>
          </div>
          <div>
            <img
              ref={userIconRef}
              src={avatarUrl}
              alt="Avatar"
              className="avatar-image"
              onClick={toggleUserMenu}
            />
            <div
              ref={userMenuRef}
              className={`dropdown-menu ${userMenuVisible ? '' : 'dropdown-hidden'}`}
            >
              {isLoggedIn ? (
                <a href="#" className="dropdown-item" onClick={handleLogout}>
                  登出
                </a>
              ) : (
                <a href="#" className="dropdown-item" onClick={handleLogin}>
                  登录
                </a>
              )}
            </div>
          </div>
        </div>
      </Header>

      <Layout>
        {/* Sider */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleCollapse}
          width={200}
          className={'layout-sider'}
        >
          <Menu
            mode="vertical"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">
              <IconHome /> 首页
            </Menu.Item>
            <Menu.Item key="2">
              <IconDashboard /> 数据分析
            </Menu.Item>
            <Menu.Item key="3">
              <IconTool /> 小工具
            </Menu.Item>
            <Menu.Item key="4">
              <IconFire /> 趋势
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Content */}
        <Content className={'layout-content'}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
