// src/services/bounty.js
import api from './api.js';

/**
 * @typedef {Object} BountyDTO
 * @property {string} Title - 标题
 * @property {string} Description - 描述
 * @property {string} Deadline - 截止日期
 * @property {string} Category - 类别
 * @property {string} DifficultyLevel - 难度等级
 * @property {string} Priority - 悬赏等级
 * @property {number} Reward - 赏金
 * @property {Array<string>} Tags - 标签
 * @property {boolean} Anonymous - 是否匿名发布
 * @property {string} PreferredSolutionType - 偏好的解决方案类型
 * @property {Array<string>} RequiredSkills - 所需技能
 * @property {string} RequiredExperience - 所需经验年限
 * @property {Array<string>} RequiredCertifications - 所需认证
 * @property {string} Visibility - 可见性
 * @property {string} Confidentiality - 保密等级
 * @property {string} ContractType - 合同类型
 * @property {Array<string>} AttachmentUrls - 附件链接
 * @property {string} Status - 当前状态
 * @property {string} Location - 地理位置
 * @property {number} Budget - 预算
 * @property {string} PaymentStatus - 付款状态
 * @property {number} ViewCount - 查看次数
 * @property {number} SubmissionCount - 提交次数
 * @property {number} CommentsCount - 评论次数
 * @property {number} Rating - 评分
 * @property {number} ReviewCount - 评价次数
 * @property {number} LikesCount - 点赞次数
 */


/**
 * @typedef {Object} CommentDTO
 * @property {string} Content - 评论内容
 * @property {string} CreatedAt - 评论的创建时间
 */

/**
 * @typedef {Object} RatingDTO
 * @property {number} score - 评分值
 */

/**
 * 最终完成清算（需JWT认证）
 * 将状态改为Settled
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const settleBountyAccounts = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/settle-accounts`);
        return response.data;
    } catch (error) {
        console.error('Error settling bounty:', error);
        throw error;
    }
};

/**
 * 发布方取消清算（处于Settling时违约 -> Cancelled）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const cancelSettlementByPublisher = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/cancel-settlement/publisher`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling settlement by publisher:', error);
        throw error;
    }
};

/**
 * 接收方取消清算（处于Settling时违约 -> Cancelled）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const cancelSettlementByReceiver = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/cancel-settlement/receiver`);
        return response.data;
    } catch (error) {
        console.error('Error cancelling settlement by receiver:', error);
        throw error;
    }
};

/**
 * 获取悬赏令列表（可带多种过滤参数）
 * @param {Object} filters
 * @param {string} [filters.status] - 可选状态，如 "Settled"
 * @param {string} [filters.publisher_id] - 发起者ID
 * @param {string} [filters.receiver_id] - 接收者ID
 * @param {number} [filters.limit=20] - 每页条数
 * @param {number} [filters.offset=0] - 偏移量
 * @returns {Promise<Array<BountyDTO>>}
 */
export const getBountiesByFilter = async (filters = {}) => {
    try {
        // 传入的 filters 中的任意字段都会被放到 query string
        const response = await api.get('/bounties', {
            params: {
                ...filters,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching bounties with filters:', error);
        throw error;
    }
};



/**
 * 创建悬赏令（需JWT认证）
 * @param {Object} bountyData - 悬赏令数据
 * @returns {Promise<BountyDTO>}
 */
export const createBounty = async (bountyData) => {
    try {
        const response = await api.post('/bounties', bountyData);
        return response.data;
    } catch (error) {
        console.error('Error creating bounty:', error);
        throw error;
    }
};

/**
 * 获取指定悬赏令
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<BountyDTO>}
 */
export const getBounty = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bounty:', error);
        throw error;
    }
};

/**
 * 获取指定悬赏令的评论
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Array<CommentDTO>>}
 */
export const getBountyComments = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bounty comments:', error);
        throw error;
    }
};

/**
 * 更新悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {Object} updateData - 更新数据
 * @returns {Promise<BountyDTO>}
 */
export const updateBounty = async (bountyId, updateData) => {
    try {
        const response = await api.put(`/bounties/${bountyId}`, updateData);
        return response.data;
    } catch (error) {
        console.error('Error updating bounty:', error);
        throw error;
    }
};

/**
 * 删除悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const deleteBounty = async (bountyId) => {
    try {
        const response = await api.delete(`/bounties/${bountyId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bounty:', error);
        throw error;
    }
};

/**
 * 点赞悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const likeBounty = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/like`);
        return response.data;
    } catch (error) {
        console.error('Error liking bounty:', error);
        throw error;
    }
};

/**
 * 取消点赞悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const unlikeBounty = async (bountyId) => {
    try {
        const response = await api.delete(`/bounties/${bountyId}/unlike`);
        return response.data;
    } catch (error) {
        console.error('Error unliking bounty:', error);
        throw error;
    }
};

/**
 * 评论悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise<CommentDTO>}
 */
export const commentOnBounty = async (bountyId, commentData) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/comment`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error commenting on bounty:', error);
        throw error;
    }
};

/**
 * 评分悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @param {Object} ratingData - 评分数据
 * @returns {Promise<Object>}
 */
export const rateBounty = async (bountyId, ratingData) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/rate`, ratingData);
        return response.data;
    } catch (error) {
        console.error('Error rating bounty:', error);
        throw error;
    }
};

/**
 * 获取用户的悬赏令互动信息（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const getUserBountyInteraction = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/interaction`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user bounty interaction:', error);
        throw error;
    }
};

/**
 * 结算悬赏令（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const settleBounty = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/settle-accounts`);
        return response.data;
    } catch (error) {
        console.error('Error settling bounty:', error);
        throw error;
    }
};

/**
 * 接收者确认提交所有里程碑（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const confirmMilestones = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/confirm-milestones`);
        return response.data;
    } catch (error) {
        console.error('Error confirming milestones:', error);
        throw error;
    }
};

/**
 * 发布者审核并确认所有里程碑（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const verifyMilestones = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/verify-milestones`);
        return response.data;
    } catch (error) {
        console.error('Error verifying milestones:', error);
        throw error;
    }
};

/**
 * 接收者申请悬赏令清算（需JWT认证）
 * @param {string} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const applySettlement = async (bountyId) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/settle`);
        return response.data;
    } catch (error) {
        console.error('Error applying settlement:', error);
        throw error;
    }
};

