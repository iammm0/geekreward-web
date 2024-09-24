import React, {useContext, useEffect, useState} from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {Badge, Dropdown, Layout, List, Menu, message} from 'antd';
import { UserContext } from './contexts/UserContext.jsx';
import UserRegister from './components/UserRegister.jsx';
import UserLogin from './components/UserLogin.jsx';
import BountyDetail from './components/BountyDetail';
import CreateBounty from './components/CreateBounty';
import BountyList from './components/BountyList';
import GeekList from './components/GeekList.jsx';
import UpdateProfile from './components/UpdateProfile.jsx';
import './index.css';
import GeekDetail from "./components/GeekDetail.jsx";
import UserProfile from "./components/UserProfile.jsx";
import {getUserInfo, logoutUser} from "./services/user.js";
import UserBounties from "./components/UserBounties.jsx";
import UpdateBounty from "./components/UpdateBounty.jsx";
import {BellOutlined, BulbFilled, BulbOutlined, MenuOutlined} from "@ant-design/icons";
import {getNotifications, markNotificationAsRead} from "./services/notification.js";
import CompleteProfile from "./components/CompleteProfile.jsx";

const { Content, Header } = Layout;

const App = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light'); // 默认主题是浅色
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
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

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotifications();
        }
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

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            message.success('通知已标记为已读');
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const notificationMenu = (
        <Menu>
            <List
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item key={item.id} onClick={() => handleMarkAsRead(item.id)}>
                        <List.Item.Meta title={item.title} description={item.description} />
                    </List.Item>
                )}
            />
        </Menu>
    );

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
            label: (
                <Dropdown overlay={notificationMenu} trigger={['hover']} placement="bottomRight">
                    <Badge count={notifications.length} offset={[10, 0]}>
                        <BellOutlined style={{ fontSize: '20px', color: 'white' }} />
                    </Badge>
                </Dropdown>
            ),
            key: '6',
            style: { marginLeft: 'auto' }
        } : null,
        user ? {
            label: (
                <Dropdown overlay={userMenu} trigger={['hover']} placement="bottomRight">
                    <MenuOutlined style={{ fontSize: '20px', color: 'white' }} />
                </Dropdown>
            ),
            key: '7',
        } : null,
        {
            label: (
                <div onClick={toggleTheme} className="theme-switcher">
                    {theme === 'light' ? <BulbOutlined style={{ fontSize: '20px' }}/> : <BulbFilled />}
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
                <Header className="header-container" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="header-logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
                </Header>
                <Content style={{ paddingTop: '200px', padding: '0 60px', width: '100%' }}>
                    <div className="site-layout-content">
                        <Routes>
                            <Route path="/register" element={<UserRegister />} />
                            <Route path="/login" element={<UserLogin />} />
                            <Route path="/bounties/:id" element={<BountyDetail />} />
                            <Route path="/create-bounty" element={user ? <CreateBounty user={user} /> : <UserLogin />} />
                            <Route path="/geeks" element={<GeekList />} />
                            <Route path="/geeks/:id" element={<GeekDetail />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/update-profile" element={<UpdateProfile />} />
                            <Route path="/user-bounties" element={<UserBounties />} />
                            <Route path="/update-bounty" element={<UpdateBounty />} />
                            <Route path="/" element={<BountyList />} />
                            <Route path="/complete-profile" element={<CompleteProfile />} />
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default App;

