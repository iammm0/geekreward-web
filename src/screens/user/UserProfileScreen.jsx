import { useContext, useEffect, useState } from 'react';
import {Button, Card, Typography, message, Tag, Skeleton} from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext.jsx';
import './UserProfileScreen.css';
import { getUserInfo } from '../../services/user.js';

const { Paragraph, Text } = Typography;

const UserProfileScreen = () => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(!user); // 如果用户信息存在，则跳过加载
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                try {
                    const userInfo = await getUserInfo();
                    setUser(userInfo);
                    setLoading(false);
                } catch (error) {
                    message.error('获取用户信息失败');
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user, setUser]);

    const handleUpdateProfile = () => {
        navigate('/update-profile');  // 跳转到更新个人资料页面
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Skeleton active />
            </div>
        );
    }

    return (
        <div className="page-container fade-in-container">
            <Card title="基本信息" bordered={false} style={{ marginBottom: 16 }} className="profile-card">
                <Paragraph className="profile-item">
                    <Text strong>用户名:</Text> {user?.Username || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>姓名:</Text> {user?.FirstName} {user?.LastName || ''}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>邮箱:</Text> {user?.Email || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>出生日期:</Text> {user?.DateOfBirth || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>性别:</Text> {user?.Gender || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>电话号码:</Text> {user?.PhoneNumber || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>地址:</Text> {user?.Address || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>城市:</Text> {user?.City || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>州/省:</Text> {user?.State || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>国家:</Text> {user?.Country || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>邮政编码:</Text> {user?.PostalCode || '未提供'}
                </Paragraph>
            </Card>
            <Card title="职业信息" bordered={false} style={{ marginBottom: 16 }} className="profile-card">
                <Paragraph className="profile-item">
                    <Text strong>机构/单位:</Text> {user?.Institution || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>部门:</Text> {user?.Department || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>工作类型:</Text> {user?.JobTitle || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>受教育水平:</Text> {user?.EducationLevel || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>专业领域:</Text> {user?.FieldOfExpertise || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>经验年限:</Text> {user?.YearsOfExperience || '未提供'}
                </Paragraph>
            </Card>
            <Card title="社交与兴趣" bordered={false} style={{ marginBottom: 16 }} className="profile-card">
                <Paragraph className="profile-item">
                    <Text strong>个人目标:</Text> {user?.Goals || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>个人技能:</Text>{' '}
                    {user?.Skills
                        ? user.Skills.map((skill) => <Tag key={skill}>{skill}</Tag>)
                        : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>个人兴趣:</Text>{' '}
                    {user?.Interests
                        ? user.Interests.map((interest) => <Tag key={interest}>{interest}</Tag>)
                        : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>掌握语言:</Text>{' '}
                    {user?.Languages
                        ? user.Languages.map((lang) => <Tag key={lang}>{lang}</Tag>)
                        : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>个人生平:</Text> {user?.Biography || '未提供'}
                </Paragraph>
            </Card>
            <Card title="成就与设置" bordered={false} style={{ marginBottom: 16 }} className="profile-card">
                <Paragraph className="profile-item">
                    <Text strong>解决的问题数量:</Text> {user?.SolvedCount || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>解决的最高难度的问题:</Text> {user?.MaxDifficulty || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>声誉评分:</Text> {user?.Reputation || '未提供'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>专业或资格证书:</Text>{' '}
                    {user?.Certifications ? user.Certifications.join(', ') : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>荣誉:</Text> {user?.Awards ? user.Awards.join(', ') : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>发表论文，著作:</Text>{' '}
                    {user?.Publications ? user.Publications.join(', ') : '无'}
                </Paragraph>
                <Paragraph className="profile-item">
                    <Text strong>参与的项目:</Text>{' '}
                    {user?.Projects ? user.Projects.join(', ') : '无'}
                </Paragraph>
            </Card>
            <div className="bounty-actions">
                <Button
                    type="primary"
                    onClick={handleUpdateProfile}
                    style={{ marginTop: 16 , width: '100%'}}
                    className="animated-button"
                >
                    更新个人资料
                </Button>
            </div>
        </div>
    );
};

export default UserProfileScreen;