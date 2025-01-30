import {useContext, useEffect, useState} from 'react';
import {Link, Route, Routes, useNavigate} from 'react-router-dom';
import {Badge, Dropdown, Layout, List, Menu, message} from 'antd';
import {UserContext} from '../contexts/UserContext.jsx';
import UserRegisterScreen from '../screens/auth/UserRegisterScreen.jsx';
import UserLoginScreen from '../screens/auth/UserLoginScreen.jsx';
import PublicBountyDetailScreen from '../screens/bounty/public/PublicBountyDetailScreen.jsx';
import CreateBountyScreen from '../screens/bounty/public/CreateBountyScreen.jsx';
import BountyListScreen from '../screens/bounty/public/BountyListScreen.jsx';
import GeekListScreen from '../screens/geek/GeekListScreen.jsx';
import './App.css';
import GeekDetailScreen from "../screens/geek/GeekDetailScreen.jsx";
import UserProfileScreen from "../screens/user/UserProfileScreen.jsx";
import {getUserInfo, logoutUser} from "../services/user.js";
import UserBountiesScreen from "../screens/bounty/manage/UserBountiesScreen.jsx";
import {BellOutlined, BulbFilled, BulbOutlined, MenuOutlined} from "@ant-design/icons";
import {getUserNotifications, markNotificationAsRead} from "../services/notification.js";
import PublisherBountyDetailScreen from "../screens/bounty/publisher/PublisherBountyDetailScreen.jsx";
import PublisherAcceptedBountyScreen from "../screens/bounty/publisher/PublisherAcceptedBountyScreen.jsx";
import ApplicantBountyManagementScreen from "../screens/bounty/applicant/ApplicantBountyManagementScreen.jsx";
import UpdateUserProfileScreen from "../screens/user/UpdateUserProfileScreen.jsx";
import NotificationDropdown from "../components/notification/NotificationDropdown.jsx";

const { Content, Header } = Layout;

const App = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [theme, setTheme] = useState(() => {
        // 首次加载时从 localStorage 获取
        return localStorage.getItem('theme') || 'system';
    });

    // 用来检测系统是否为 dark
    const [systemPrefersDark, setSystemPrefersDark] = useState(false);

    // 初始判断系统主题
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemPrefersDark(mediaQuery.matches);

        // 监听系统主题变化
        const handleChange = (e) => {
            setSystemPrefersDark(e.matches);
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // 根据 theme/systemPrefersDark 来决定最终使用的 themeMode
    const effectiveTheme = theme === 'system'
        ? (systemPrefersDark ? 'dark' : 'light')
        : theme;

    // 监听 effectiveTheme 并更新 <html data-theme="xxx">
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', effectiveTheme);
    }, [effectiveTheme]);

    // 切换主题的函数
    const toggleTheme = () => {
        // 如果当前是 system，就直接切到 light 或 dark
        // 如果当前是 light，就切到 dark
        // 如果当前是 dark，就切到 system（或者你也可以循环：dark -> light -> system）
        // 这里演示一种简单循环策略
        if (theme === 'system') {
            // system -> light
            setTheme('light');
            localStorage.setItem('theme', 'light');
        } else if (theme === 'light') {
            // light -> dark
            setTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            // dark -> system
            setTheme('system');
            localStorage.setItem('theme', 'system');
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userInfo = await getUserInfo();
                    setUser(userInfo);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUser();
    }, []);


    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
            message.success('成功登出');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // 主菜单
    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/profile">个人资料</Link>
            </Menu.Item>
            <Menu.Item key="user-bounties">
                <Link to="/user-bounties">我的悬赏</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                登出
            </Menu.Item>
        </Menu>
    );



    const menuItems = [
        { label: <Link to="/">悬赏令</Link>, key: '1' },
        { label: <Link to="/geeks">极客</Link>, key: '2' },
        user ? { label: <Link to="/create-bounty">发布悬赏令</Link>, key: '3' } : null,
        !user ? { label: <Link to="/login">登录</Link>, key: '4', style: { marginLeft: 'auto' } } : null,
        !user ? { label: <Link to="/register">注册</Link>, key: '5' } : null,
        user ? {
            label: <NotificationDropdown />,
            key: '6',
            style: { marginLeft: 'auto' }
        } : null,
        user ? {
            label: (
                <Dropdown overlay={userMenu} trigger={['hover']} placement="bottomRight">
                    <MenuOutlined className="header-icon" />
                </Dropdown>
            ),
            key: '7',
        } : null,
        {
            label: (
                <div onClick={toggleTheme} className="theme-switcher">
                    {effectiveTheme === 'light' ? <BulbOutlined style={{ fontSize: '20px' }}/> : <BulbFilled style={{ fontSize: '20px' }}/>}
                </div>
            ),
            key: '8'
        }
    ].filter(Boolean);

    // Check the menuItems type and log it
    console.log(Array.isArray(menuItems), menuItems);

    return (
        <div id="root">
            <Layout style={{ minHeight: '100vh', width: '100%' }}>
                <Header className="header-container">
                    <div className="header-logo" onClick={() => navigate('/')}>
                        🔖 GeekReward
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        items={menuItems}
                    />
                </Header>

                <Content style={{ paddingTop: '200px', padding: '0 60px', width: '100%' }}>
                    <div className="site-layout-content">
                        <Routes>
                            {/* 认证相关页面 */}
                            <Route path="/register" element={<UserRegisterScreen />} />
                            <Route path="/login" element={<UserLoginScreen />} />

                            {/* 用户相关页面 */}
                            <Route path="/profile" element={<UserProfileScreen />} />
                            <Route path="/update-profile" element={<UpdateUserProfileScreen />} />

                            {/* 极客相关页面 */}
                            <Route path="/geeks" element={<GeekListScreen />} />
                            <Route path="/geeks/:id" element={<GeekDetailScreen />} />

                            {/* 申请者悬赏令页面 */}
                            <Route path="/applicant-bounty-management/:id" element={<ApplicantBountyManagementScreen />} />

                            {/* 公共悬赏令相关页面 */}
                            <Route path="/" element={<BountyListScreen />} />
                            <Route path="/bounties/:id" element={<PublicBountyDetailScreen />} />
                            <Route path="/create-bounty" element={user ? <CreateBountyScreen /> : <UserLoginScreen />} />

                            {/* 发布者悬赏令页面 */}
                            <Route path="/publisher-bounty-detail/:id" element={<PublisherBountyDetailScreen />} />
                            <Route path="/publisher/accepted/:id" element={<PublisherAcceptedBountyScreen />} />

                            <Route path="/user-bounties" element={<UserBountiesScreen />} />
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default App;

