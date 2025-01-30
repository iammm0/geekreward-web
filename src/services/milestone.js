// src/services/milestone.js
import api from './api';

/**
 * @typedef {Object} MilestoneDTO
 * @property {string} id - 里程碑 ID
 * @property {string} title - 标题
 * @property {string} description - 描述
 * @property {string} due_date - 截止日期
 * @property {string} promulgator_id - 发布者 ID
 * @property {string} receiver_id - 接收者 ID
 * @property {boolean} submitted - 是否已提交
 * @property {string} createdAt - 创建时间
 * @property {string} updatedAt - 更新时间
 */

/**
 * 获取指定悬赏令的里程碑
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<MilestoneDTO>>}
 */
export const getMilestonesByBountyID = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/milestones`);
        return response.data;
    } catch (error) {
        console.error('Error fetching milestones:', error);
        throw error;
    }
};

/**
 * 悬赏令发布者公布里程碑（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {Object} milestoneData - 里程碑数据
 * @returns {Promise<MilestoneDTO>}
 */
export const createMilestone = async (bountyId, milestoneData) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/milestones`, milestoneData);
        return response.data;
    } catch (error) {
        console.error('Error creating milestone:', error);
        throw error;
    }
};

/**
 * 悬赏令发布者更新里程碑（需JWT认证）
 * @param {string} milestoneId - 里程碑 ID
 * @param bountyId
 * @param {Object} updateData - 更新数据
 * @returns {Promise<MilestoneDTO>}
 */
export const updateMilestone = async (milestoneId, bountyId, updateData) => {
    try {
        const response = await api.put(`/bounties/${bountyId}/milestones/${milestoneId}/promulgator`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating milestone:', error);
        throw error;
    }
};

/**
 * 悬赏接收者更新里程碑（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {string} milestoneId - 里程碑 ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<MilestoneDTO>}
 */
export const updateMilestoneByReceiver = async (bountyId, milestoneId, updateData) => {
    try {
        const response = await api.put(`/bounties/${bountyId}/milestones/${milestoneId}/receiver`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating milestone by receiver:', error);
        throw error;
    }
};

/**
 * 删除里程碑（需JWT认证）
 * @param {string} milestoneId - 里程碑 ID
 * @param bountyId
 * @returns {Promise<Object>}
 */
export const deleteMilestone = async (milestoneId, bountyId) => {
    try {
        const response = await api.delete(`/bounties/${bountyId}/milestones/${milestoneId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting milestone:', error);
        throw error;
    }
};