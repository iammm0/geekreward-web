// 创建申请
import api from "./api.js";

/**
 * @typedef {Object} ApplicationDTO
 * @property {number} ID - 申请的唯一标识符
 * @property {string} note - 申请备注
 * @property {number} bountyId - 悬赏令 ID
 */

/**
 * 极客申请接收悬赏令
 * @param {string} bountyId - 悬赏令 ID
 * @param {string} note - 申请备注
 * @returns {Promise<ApplicationDTO>}
 */
export const applyForBounty = async (bountyId, note) => {
    try {
        const response = await api.post('/applications', { bountyId, note });
        return response.data;
    } catch (error) {
        console.error('Error applying for bounty:', error);
        throw error;
    }
};

/**
 * 获取悬赏令的所有申请
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<ApplicationDTO>>}
 */
export const getApplicationsByBountyId = async (bountyId) => {
    try {
        const response = await api.get(`/applications/${bountyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

/**
 * 拒绝申请
 * @param {number} applicationId - 申请 ID
 * @returns {Promise<Object>}
 */
export const rejectApplication = async (applicationId) => {
    try {
        const response = await api.put(`/applications/${applicationId}/reject`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting application:', error);
        throw error;
    }
};