// src/services/milestone.js
import api from './api';

/**
 * @typedef {Object} MilestoneDTO
 * @property {number} ID - 里程碑的唯一标识符
 * @property {string} title - 里程碑标题
 * @property {string} description - 里程碑描述
 * @property {string} dueDate - 里程碑截止日期
 * @property {number} bountyId - 所属悬赏令的 ID
 */

/**
 * 获取悬赏令的里程碑详情
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<MilestoneDTO>>}
 */
export const getMilestonesByBountyId = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/milestones`);
        return response.data;
    } catch (error) {
        console.error('Error fetching milestones:', error);
        throw error;
    }
};