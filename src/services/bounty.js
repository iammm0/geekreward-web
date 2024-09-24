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
 * 创建新的悬赏令
 * @param {BountyDTO} data - 悬赏令数据
 * @returns {Promise<Object>}
 */
export const createBounty = async (data) => {
    try {
        const response = await api.post('/bounties', data);
        return response.data;
    } catch (error) {
        console.error('Error creating bounty:', error);
        throw error;
    }
};

/**
 * 获取悬赏令详情
 * @param {string} id - 悬赏令 ID
 * @returns {Promise<BountyDTO>}
 */
export const getBountyDetail = async (id) => {
    try {
        const response = await api.get(`/bounties/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bounty detail:', error);
        throw error;
    }
};

/**
 * 获取所有悬赏令
 * @returns {Promise<Array<BountyDTO>>}
 */
export const getBounties = async () => {
    try {
        const response = await api.get('/bounties');
        return response.data;
    } catch (error) {
        console.error('Error fetching bounties:', error);
        throw error;
    }
};

/**
 * 更新悬赏令
 * @param {number} id - 悬赏令 ID
 * @param {BountyDTO} data - 更新的数据
 * @returns {Promise<BountyDTO>}
 */
export const updateBounty = async (id, data) => {
    try {
        const response = await api.put(`/bounties/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating bounty:', error);
        throw error;
    }
};


/**
 * 删除悬赏令
 * @param {number} id - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const deleteBounty = async (id) => {
    try {
        const response = await api.delete(`/bounties/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting bounty:', error);
        throw error;
    }
};

/**
 * 获取用户发布的悬赏令
 * @returns {Promise<Array<BountyDTO>>}
 */
export const getUserBounties = async () => {
    try {
        const response = await api.get('/user/bounties');
        return response.data;
    } catch (error) {
        console.error('Error fetching user bounties:', error);
        throw error;
    }
};

/**
 * 获取用户接收的悬赏令
 * @returns {Promise<Array<BountyDTO>>}
 */
export const getReceivedBounties = async () => {
    try {
        const response = await api.get('/user/received-bounties');
        return response.data;
    } catch (error) {
        console.error('Error fetching received bounties:', error);
        throw error;
    }
};

/**
 * 点赞悬赏令
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
 * 取消点赞悬赏令
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
 * 添加评论
 * @param {string} bountyId - 悬赏令 ID
 * @param {{content: string}} commentData - 评论内容
 * @returns {Promise<Object>}
 */
export const addComment = async (bountyId, commentData) => {
    try {
        const response = await api.post(`/bounties/${bountyId}/comment`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

/**
 * 评分悬赏令
 * @param {string} bountyId - 悬赏令 ID
 * @param {RatingDTO} ratingData - 评分数据
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
 * 获取悬赏令的评论
 * @param {number} bountyId - 悬赏令 ID
 * @returns {Promise<Array<CommentDTO>>}
 */
export const getComments = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

/**
 * 获取用户与悬赏令的交互信息
 * @param {number} bountyId - 悬赏令 ID
 * @returns {Promise<Object>}
 */
export const getUserBountyInteraction = async (bountyId) => {
    try {
        const response = await api.get(`/bounties/${bountyId}/interaction`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user interaction:', error);
        throw error;
    }
};

