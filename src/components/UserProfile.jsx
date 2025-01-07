import React, { useContext, useEffect, useState } from 'react';
import {Button, Card, Typography, message, Tag} from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import '../styles/UserProfile.css';
import { getUserInfo } from '../services/user.js';

const { Paragraph, Text } = Typography;

const UserProfile = () => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
                setLoading(false);
            } catch (error) {
                message.error('获取用户信息失败');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setUser]);

    const handleUpdateProfile = () => {
        navigate('/update-profile');  // 跳转到更新个人资料页面
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="page-container">
            <h2 className="page-title">个人资料</h2>
            <Card className="card">
                <Card title="基本信息" bordered={false} style={{marginBottom: 16}}>
                    <Paragraph><Text strong>用户名:</Text> {user.Username}</Paragraph>
                    <Paragraph><Text strong>姓名:</Text> {user.FirstName} {user.LastName}</Paragraph>
                    <Paragraph><Text strong>邮箱:</Text> {user.Email}</Paragraph>
                    <Paragraph><Text strong>出生日期:</Text> {user.DateOfBirth}</Paragraph>
                    <Paragraph><Text strong>性别:</Text> {user.Gender}</Paragraph>
                    <Paragraph><Text strong>电话号码:</Text> {user.PhoneNumber}</Paragraph>
                    <Paragraph><Text strong>地址:</Text> {user.Address}</Paragraph>
                    <Paragraph><Text strong>城市:</Text> {user.City}</Paragraph>
                    <Paragraph><Text strong>州/省:</Text> {user.State}</Paragraph>
                    <Paragraph><Text strong>国家:</Text> {user.Country}</Paragraph>
                    <Paragraph><Text strong>邮政编码:</Text> {user.PostalCode}</Paragraph>
                </Card>
                <br></br>
                <Card title="职业信息" bordered={false} style={{marginBottom: 16}}>
                    <Paragraph><Text strong>机构/单位:</Text> {user.Institution}</Paragraph>
                    <Paragraph><Text strong>部门:</Text> {user.Department}</Paragraph>
                    <Paragraph><Text strong>工作类型:</Text> {user.JobTitle}</Paragraph>
                    <Paragraph><Text strong>受教育水平:</Text> {user.EducationLevel}</Paragraph>
                    <Paragraph><Text strong>专业领域:</Text> {user.FieldOfExpertise}</Paragraph>
                    <Paragraph><Text strong>经验年限:</Text> {user.YearsOfExperience}</Paragraph>
                </Card>
                <br></br>
                <Card title="社交与兴趣" bordered={false} style={{marginBottom: 16}}>
                    <Paragraph><Text strong>个人目标:</Text> {user.Goals}</Paragraph>
                    <Paragraph><Text strong>个人技能:</Text> {user.Skills ? user.Skills.map(skill => <Tag
                        key={skill}>{skill}</Tag>) : '无'}</Paragraph>
                    <Paragraph><Text strong>个人兴趣:</Text> {user.Interests ? user.Interests.map(interest => <Tag
                        key={interest}>{interest}</Tag>) : '无'}</Paragraph>
                    <Paragraph><Text strong>掌握语言:</Text> {user.Languages ? user.Languages.map(lang => <Tag
                        key={lang}>{lang}</Tag>) : '无'}</Paragraph>
                    <Paragraph><Text strong>个人生平:</Text> {user.Biography}</Paragraph>
                </Card>
                <br></br>
                <Card title="成就与设置" bordered={false} style={{marginBottom: 16}}>
                    <Paragraph><Text strong>解决的问题数量:</Text> {user.SolvedCount}</Paragraph>
                    <Paragraph><Text strong>解决的最高难度的问题:</Text> {user.MaxDifficulty}</Paragraph>
                    <Paragraph><Text strong>声誉评分:</Text> {user.Reputation}</Paragraph>
                    <Paragraph><Text
                        strong>专业或资格证书:</Text> {user.Certifications ? user.Certifications.join(', ') : '无'}
                    </Paragraph>
                    <Paragraph><Text strong>荣誉:</Text> {user.Awards ? user.Awards.join(', ') : '无'}</Paragraph>
                    <Paragraph><Text
                        strong>发表论文，著作:</Text> {user.Publications ? user.Publications.join(', ') : '无'}
                    </Paragraph>
                    <Paragraph><Text strong>参与的项目:</Text> {user.Projects ? user.Projects.join(', ') : '无'}
                    </Paragraph>
                </Card>

                <Button type="primary" onClick={handleUpdateProfile} style={{ marginTop: 16 }}>
                    更新个人资料
                </Button>
            </Card>
        </div>
    );
};

export default UserProfile;
