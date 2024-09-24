// src/services/geek.js
import api from './api';

/**
 * @typedef {Object} GeekDTO
 * @property {number} ID - 极客的唯一标识符
 * @property {string} Username - 极客用户名
 * @property {string} FirstName - 极客名
 * @property {string} LastName - 极客姓氏
 * @property {string} Email - 极客邮箱
 * @property {string} Biography - 极客个人简介
 * @property {string} FieldOfExpertise - 专业领域
 * @property {string} MaxDifficulty - 解决最高难度悬赏令
 * @property {Array<string>} Skills - 技能
 * @property {number} YearsOfExperience - 经验年限
 * @property {number} SolvedCount - 声誉评分
 * @property {number} SubmissionCount - 提交次数
 * @property {number} CompletionCount - 完成次数
 * @property {number} ReviewCount - 评价次数
 * @property {number} Rating - 评分
 * @property {number} Reputation - 声誉评分
 *
 */

/**
 * 获取极客列表
 * @returns {Promise<Array<GeekDTO>>}
 */
export const getGeeks = async () => {
    try {
        const response = await api.get('/geeks');
        return response.data;
    } catch (error) {
        console.error('Error fetching geeks:', error);
        throw error;
    }
};

/**
 * 获取极客详情
 * @param {number} id - 极客 ID
 * @returns {Promise<GeekDTO>}
 */
export const getGeekDetail = async (id) => {
    try {
        const response = await api.get(`/geeks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching geek detail:', error);
        throw error;
    }
};