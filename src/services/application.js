// src/services/applications.js
import api from "./api.js";

/**
 * @typedef {Object} ApplicationDTO
 * @property {string} ID - 申请的唯一标识符
 * @property {string} note - 申请备注
 * @property {string} bountyId - 悬赏令 ID
 */

/**
 * 向特定悬赏任务发出悬赏令申请（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {string} note - 申请备注
 * @returns {Promise<ApplicationDTO>}
 */
export const createApplication = async (bountyId, note) => {
    try {
        const response = await api.post(`/applications/${bountyId}`, { note });
        return response.data;
    } catch (error) {
        console.error('Error applying for bounty:', error);
        throw error;
    }
};

/**
 * 获取悬赏令的所有申请（发布者，需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<ApplicationDTO>>}
 */
export const getApplicationsByBountyId = async (bountyId) => {
    try {
        const response = await api.get(`/applications/${bountyId}/private`);
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

/**
 * 获取公开的申请信息（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<ApplicationDTO>>}
 */
export const getPublicApplications = async (bountyId) => {
    try {
        const response = await api.get(`/applications/${bountyId}/public`);
        return response.data;
    } catch (error) {
        console.error('Error fetching public applications:', error);
        throw error;
    }
};

/**
 * 拒绝申请（需JWT认证）
 * @param {string} applicationId - 申请 ID
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

/**
 * 批准悬赏令申请（需JWT认证）
 * @param {string} applicationId - 申请 ID
 * @returns {Promise<Object>}
 */
export const approveApplication = async (applicationId) => {
    try {
        const response = await api.put(`/applications/${applicationId}/approve`);
        return response.data;
    } catch (error) {
        console.error('Error approving application:', error);
        throw error;
    }
};
