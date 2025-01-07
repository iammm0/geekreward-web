// 获取用户通知
import api from "./api.js";

/**
 * @typedef {Object} NotificationDTO
 * @property {number} ID - 通知的唯一标识符
 * @property {string} title - 通知标题
 * @property {string} description - 通知描述
 * @property {boolean} read - 是否已读
 * @property {Date} createdAt - 创建时间
 */

/**
 * 获取用户的所有通知（需JWT认证）
 * @returns {Promise<Array<NotificationDTO>>}
 */
export const getUserNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching user notifications:', error);
        throw error;
    }
};

/**
 * 标记通知为已读（需JWT认证）
 * @param {string} notificationId - 通知 ID
 * @returns {Promise<Object>}
 */
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * 删除通知（需JWT认证）
 * @param {string} notificationId - 通知 ID
 * @returns {Promise<Object>}
 */
export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

/**
 * 创建通知（需JWT认证）
 * @param {Object} notificationData - 通知数据
 * @returns {Promise<Object>}
 */
export const createNotification = async (notificationData) => {
    try {
        const response = await api.post('/notifications', notificationData);
        return response.data;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};