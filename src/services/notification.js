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
 * 获取用户通知
 * @returns {Promise<Array<NotificationDTO>>}
 */
export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

/**
 * 标记通知为已读
 * @param {number} notificationId - 通知 ID
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