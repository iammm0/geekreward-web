// src/services/user.js

import api from "./api.js";

/**
 * @typedef {Object} LoginDTO
 * @property {string} Email - 用户邮箱
 * @property {string} Password - 用户密码
 */

/**
 * @typedef {Object} RegisterInputDTO
 * @property {string} Username - 用户名
 * @property {string} Email - 用户邮箱
 * @property {string} Password - 用户密码
 * @property {string} FirstName - 名字
 * @property {string} LastName - 姓氏
 * @property {string} [ProfilePicture] - 头像（可选）
 * @property {string} [DateOfBirth] - ISO 8601 格式的出生日期（可选）
 * @property {string} [Gender] - 性别（可选）
 * @property {string} [FieldOfExpertise] - 专业领域（可选）
 * @property {string} [EducationLevel] - 受教育水平（可选）
 * @property {Array<string>} [Skills] - 技能（可选）
 */


/**
 * @typedef {Object} UserProfileDTO
 * @property {string} Username - 用户名
 * @property {string} Email - 用户邮箱
 * @property {string} FirstName - 名
 * @property {string} LastName - 姓氏
 * @property {string} DateOfBirth - 出生日期
 * @property {string} Gender - 性别
 * @property {string} PhoneNumber - 电话号码
 * @property {string} Address - 地址
 * @property {string} City - 城市
 * @property {string} State - 州/省
 * @property {string} Country - 国家
 * @property {string} PostalCode - 邮政编码
 * @property {string} Institution - 机构/单位
 * @property {string} Department - 部门
 * @property {string} JobTitle - 工作类型
 * @property {string} EducationLevel - 受教育水平
 * @property {string} FieldOfExpertise - 专业领域
 * @property {string} YearsOfExperience - 经验年限
 * @property {Array<string>} Skills - 个人技能
 * @property {Array<string>} Certifications - 专业或资格证书
 * @property {string} ProfilePictureUrl - 用户头像的URL
 * @property {string} Goals - 个人目标
 * @property {Array<string>} Interests - 兴趣
 * @property {Array<string>} Languages - 语言
 * @property {Array<string>} Publications - 论文著作
 * @property {Array<string>} Awards - 获得奖项
 * @property {Array<string>} Projects - 参与的项目
 */

/**
 * 注册新用户
 * @param {RegisterInput} data - 注册信息
 * @returns {Promise<Object>}
 */
export const registerUser = async (data, p) => {
    const formData = new FormData();

    formData.append('Username', data.Username);
    formData.append('Email', data.Email);
    formData.append('Password', data.Password);
    formData.append('FirstName', data.FirstName);
    formData.append('LastName', data.LastName);
    formData.append('DateOfBirth', data.DateOfBirth);
    formData.append('Gender', data.Gender);

    if (data.ProfilePicture) {
        formData.append('ProfilePicture', data.ProfilePicture);
    }
    if (data.FieldOfExpertise) {
        formData.append('FieldOfExpertise', data.FieldOfExpertise);
    }
    if (data.EducationLevel) {
        formData.append('EducationLevel', data.EducationLevel);
    }
    if (data.Skills && data.Skills.length > 0) {
        formData.append('Skills', JSON.stringify(data.Skills));
    }

    try {
        const response = await api.post('/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * 用户登录
 * @param {LoginDTO} data - 登录信息
 * @returns {Promise<Object>}
 */
export const loginUser = async (data) => {
    try {
        const response = await api.post('/login', data);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

/**
 * 更新用户个人信息
 * @param {UserProfileDTO} data - 用户信息
 * @returns {Promise<UserProfileDTO>}
 */
export const updateUserInfo = async (data) => {
    try {
        const response = await api.put('/user/profile', data);
        return response.data;
    } catch (error) {
        console.error('Error updating user info:', error);
        throw error;
    }
};


/**
 * 用户登出
 */
export const logoutUser = async () => {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

/**
 * 获取用户个人信息
 * @returns {Promise<UserProfileDTO>}
 */
export const getUserInfo = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

