import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, List, Menu, message, Spin, Modal } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './NotificationDropdown.css';
import { getUserNotifications, markNotificationAsRead } from "../../services/notification.js";

const isAuthenticated = !!localStorage.getItem('authToken');

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 获取通知数据
    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const data = await getUserNotifications();
                console.log("Fetched Notifications:", data); // 调试日志
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                message.error('加载通知失败');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // 监听 notifications 状态变化
    useEffect(() => {
        console.log("Notifications State:", notifications);
    }, [notifications]);

    // 标记通知为已读
    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications((prev) => prev.filter((n) => n.ID !== notificationId)); // 使用大写ID
            message.success('通知已标记为已读');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            message.error('标记通知为已读失败');
        }
    };

    // 打开通知详情
    const openNotificationDetails = (notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
        // 标记为已读
        handleMarkAsRead(notification.ID);
    };

    // 渲染通知列表
    const notificationMenu = (
        <Menu className="notification-menu">
            {loading ? (
                <div className="spinner-container">
                    <Spin />
                </div>
            ) : notifications.length === 0 ? (
                <Menu.Item key="no-notifications">
                    <span>暂无新通知</span>
                </Menu.Item>
            ) : (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            key={item.ID} // 使用大写ID
                            onClick={() => openNotificationDetails(item)} // 使用大写ID
                            className="notification-item"
                        >
                            <List.Item.Meta
                                title={item.Title} // 使用大写Title
                                description={item.Description} // 使用大写Description
                            />
                        </List.Item>
                    )}
                />
            )}
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
                <Badge count={notifications.length} offset={[10, 0]}>
                    <BellOutlined className="header-icon" />
                </Badge>
            </Dropdown>
            <Modal
                title={selectedNotification?.Title}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <p>{selectedNotification?.Description}</p>
                {/* 如果有其他详细信息，可以在此处添加 */}
            </Modal>
        </>
    );
};

// 定义 PropTypes（如果需要）
NotificationDropdown.propTypes = {
    // 如果需要传递 props，可以在这里定义
};

export default NotificationDropdown;
