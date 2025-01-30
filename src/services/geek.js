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
 * 获取极客排行榜概览信息
 * @returns {Promise<Array<GeekDTO>>}
 */
export const getTopGeeks = async () => {
    try {
        const response = await api.get('/geeks');
        return response.data;
    } catch (error) {
        console.error('Error fetching top geeks:', error);
        throw error;
    }
};

/**
 * 获取指定ID的极客公开信息
 * @param {string} geekId - 极客 ID
 * @returns {Promise<GeekDTO>}
 */
export const getGeekByID = async (geekId) => {
    try {
        const response = await api.get(`/geeks/${geekId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching geek by ID:', error);
        throw error;
    }
};

/**
 * 向特定极客发出组队邀请（需JWT认证）
 * @param {string} geekId - 极客 ID
 * @returns {Promise<Object>}
 */
export const sendInvitation = async (geekId,) => {
    try {
        const response = await api.post(`/geeks/${geekId}/invitation`);
        return response.data;
    } catch (error) {
        console.error('Error sending invitation:', error);
        throw error;
    }
};

/**
 * 向特定极客或团队表达好感（需JWT认证）
 * @param {string} geekId - 极客 ID
 * @returns {Promise<Object>}
 */
export const expressAffection = async (geekId) => {
    try {
        const response = await api.post(`/geeks/${geekId}/express-affection`);
        return response.data;
    } catch (error) {
        console.error('Error expressing affection:', error);
        throw error;
    }
};