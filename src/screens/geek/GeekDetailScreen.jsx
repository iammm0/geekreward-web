import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Avatar, Card, Divider, message, Tag, Typography} from 'antd';
import './GeekDetailScreen.css';
import {expressAffection, getGeekByID, sendInvitation} from '../../services/geek.js';
import Title from "antd/es/skeleton/Title.js";

const { Paragraph, Text } = Typography;

/**
 * @typedef {import('../models/UserDTO.js').User} User
 */

const GeekDetailScreen = () => {
    const { id } = useParams();
    const [geek, setGeek] = useState(/** @type {User | null} */ (null));

    useEffect(() => {
        const fetchGeek = async () => {
            try {
                const data = await getGeekByID(id);
                setGeek(data);
            } catch (error) {
                console.error('Error fetching geek detail:', error);
            }
        };
        fetchGeek();
    }, [id]);

    const handleExpressAppreciation = async () => {
        try {
            await expressAffection(id);
            message.success('已成功表达好感！');
        } catch (error) {
            console.error('Error expressing appreciation:', error);
            message.error('表达好感失败，请稍后重试');
        }
    };

    const handleSendTeamInvitation = async () => {
        try {
            await sendInvitation(id);
            message.success('组队邀请已发送！');
        } catch (error) {
            console.error('Error sending team invitation:', error);
            message.error('组队邀请发送失败，请稍后重试');
        }
    };


    if (!geek) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="geek-detail-container fade-in-container">
            <div className="action-area action-left" onClick={handleExpressAppreciation}>
                <div className="action-text">表达好感</div>
                <div className="action-arrow">→</div>
            </div>

            {/* 中间主要内容 */}
            <div className="main-content">


                {/* 基本信息 */}
                <div className="geek-profile">
                    <Avatar
                        src={geek.Avatar}
                        size={96}
                        className="geek-avatar"
                    />
                    <div className="geek-meta">
                        <div className="geek-field">
                            <Text className="field-label">用户名:</Text>
                            <Text className="field-value">{geek.Username || '未提供'}</Text>
                        </div>
                        <div className="geek-field">
                            <Text className="field-label">姓名:</Text>
                            <Text className="field-value">{geek.FirstName} {geek.LastName || '未提供'}</Text>
                        </div>
                        <div className="geek-field">
                            <Text className="field-label">邮箱:</Text>
                            <Text className="field-value geek-email">{geek.Email || '未提供'}</Text>
                        </div>
                        <Paragraph className="geek-field">
                            <Text className="field-label">个人简介:</Text>
                            <Text className="field-value">{geek.Biography || '未提供'}</Text>
                        </Paragraph>
                    </div>
                </div>

                {/* 专业信息 */}
                <Paragraph>
                    <Text strong>专业领域:</Text> {geek.FieldOfExpertise || '未提供'}
                </Paragraph>
                <Paragraph>
                    <Text strong>技能:</Text>{' '}
                    {geek.Skills
                        ? geek.Skills.map(skill => <Tag key={skill}>{skill}</Tag>)
                        : '无'}
                </Paragraph>
                <Paragraph>
                    <Text strong>经验年限:</Text> {geek.YearsOfExperience || '未提供'}
                </Paragraph>

                {/* 成就与评分 */}
                <Paragraph>
                    <Text strong>解决问题数量:</Text> {geek.SolvedCount || 0}
                </Paragraph>
                <Paragraph>
                    <Text strong>解决最高难度问题:</Text> {geek.MaxDifficulty || '未提供'}
                </Paragraph>
                <Paragraph>
                    <Text strong>声誉评分:</Text> {geek.Reputation || '未提供'}
                </Paragraph>
            </div>

            <div className="action-area action-right" onClick={handleSendTeamInvitation}>
                <div className="action-text">发送邀请</div>
                <div className="action-arrow">←</div>
            </div>
        </div>
    );
};

export default GeekDetailScreen;
