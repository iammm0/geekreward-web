import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserContext } from '../contexts/UserContext';
import '../styles/Profile.css';
import {getUserInfo, updateUserInfo} from "../services/user.js";

const UserProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
                form.setFieldsValue(userInfo);
            } catch (error) {
                message.error('获取用户信息失败');
            }
        };

        if (user) {
            form.setFieldsValue(user);
        } else {
            fetchUserData();
        }
    }, [user, form, setUser]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const updatedUser = await updateUserInfo(values);
            setUser(updatedUser);
            message.success('个人资料更新成功');
        } catch (error) {
            message.error('更新个人资料失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>个人资料</h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱地址', type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="姓名" name="firstName" >
                    <Input />
                </Form.Item>
                <Form.Item label="姓氏" name="lastName">
                    <Input />
                </Form.Item>
                <Form.Item label="出生日期" name="dateOfBirth">
                    <Input type="date" />
                </Form.Item>
                <Form.Item label="性别" name="gender">
                    <Input />
                </Form.Item>
                <Form.Item label="电话号码" name="phoneNumber">
                    <Input />
                </Form.Item>
                <Form.Item label="地址" name="address">
                    <Input />
                </Form.Item>
                <Form.Item label="城市" name="city">
                    <Input />
                </Form.Item>
                <Form.Item label="州/省" name="state">
                    <Input />
                </Form.Item>
                <Form.Item label="国家" name="country">
                    <Input />
                </Form.Item>
                <Form.Item label="邮政编码" name="postalCode">
                    <Input />
                </Form.Item>
                <Form.Item label="机构/单位" name="institution">
                    <Input />
                </Form.Item>
                <Form.Item label="部门" name="department">
                    <Input />
                </Form.Item>
                <Form.Item label="工作类型" name="jobTitle">
                    <Input />
                </Form.Item>
                <Form.Item label="受教育水平" name="educationLevel">
                    <Input />
                </Form.Item>
                <Form.Item label="专业领域" name="fieldOfExpertise">
                    <Input />
                </Form.Item>
                <Form.Item label="经验年限" name="yearsOfExperience">
                    <Input />
                </Form.Item>
                <Form.Item label="个人照片" name="profilePicture">
                    <Input />
                </Form.Item>
                <Form.Item label="个人生平" name="biography">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="Github个人信息" name="gitHubProfile">
                    <Input />
                </Form.Item>
                <Form.Item label="个人网站" name="website">
                    <Input />
                </Form.Item>
                <Form.Item label="个人目标" name="goals">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="个人技能" name="skills">
                    <Input />
                </Form.Item>
                <Form.Item label="个人兴趣" name="interests">
                    <Input />
                </Form.Item>
                <Form.Item label="掌握语言" name="languages">
                    <Input />
                </Form.Item>
                <Form.Item label="专业或资格证书" name="certifications">
                    <Input />
                </Form.Item>
                <Form.Item label="荣誉" name="awards">
                    <Input />
                </Form.Item>
                <Form.Item label="发表论文，著作" name="publications">
                    <Input />
                </Form.Item>
                <Form.Item label="参与的项目" name="projects">
                    <Input />
                </Form.Item>
                <Form.Item label="个人爱好" name="hobbies">
                    <Input />
                </Form.Item>
                <Form.Item label="社交账号" name="socialMediaHandles">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="专业协会" name="professionalAffiliations">
                    <Input />
                </Form.Item>
                <Form.Item label="用户的会员资格" name="memberships">
                    <Input />
                </Form.Item>
                <Form.Item label="用户偏好设置" name="preferences">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="邮件偏好设置" name="emailPreferences">
                    <Input />
                </Form.Item>
                <Form.Item label="联系方式偏好设置" name="contactPreferences">
                    <Input />
                </Form.Item>
                <Form.Item label="安全问题和答案" name="securityQuestions">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="是否启用两步验证" name="twoFactorEnabled">
                    <Input type="checkbox" />
                </Form.Item>
                <Form.Item label="用户所在时区" name="timezone">
                    <Input />
                </Form.Item>
                <Form.Item label="用户偏好的语言" name="preferredLanguage">
                    <Input />
                </Form.Item>
                <Form.Item label="解决的问题数量" name="solvedCount">
                    <Input />
                </Form.Item>
                <Form.Item label="解决的最高难度的问题" name="maxDifficulty">
                    <Input />
                </Form.Item>
                <Form.Item label="声誉评分" name="reputation">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        更新资料
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserProfile;
