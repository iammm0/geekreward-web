import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Col, Row, Tag, Typography} from 'antd';
import '../styles/GeekDetail.css';
import { getGeekDetail } from '../services/geek.js';

const { Paragraph, Text } = Typography;

/**
 * @typedef {import('../models/UserDTO.js').User} User
 */

const GeekDetail = () => {
    const { id } = useParams();
    const [geek, setGeek] = useState(/** @type {User | null} */ (null));

    useEffect(() => {
        const fetchGeek = async () => {
            try {
                const data = await getGeekDetail(id);
                setGeek(data);
            } catch (error) {
                console.error('Error fetching geek detail:', error);
            }
        };
        fetchGeek();
    }, [id]);

    if (!geek) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="page-container">
            <h2 className="page-title">极客详情</h2>
            <Card className="card">

                <Card title="基本信息" bordered={false} style={{ marginBottom: 16 }}>
                    <Paragraph><Text strong>用户名:</Text> {geek.Username}</Paragraph>
                    <Paragraph><Text strong>姓名:</Text> {geek.FirstName} {geek.LastName}</Paragraph>
                    <Paragraph><Text strong>邮箱:</Text> {geek.Email}</Paragraph>
                    <Paragraph><Text strong>个人简介:</Text> {geek.Biography}</Paragraph>
                </Card>

                <Card title="专业信息" bordered={false} style={{ marginBottom: 16 }}>
                    <Paragraph><Text strong>专业领域:</Text> {geek.FieldOfExpertise}</Paragraph>
                    <Paragraph>
                        <Text strong>技能:</Text> {geek.Skills ? geek.Skills.map(skill => <Tag key={skill}>{skill}</Tag>) : '无'}
                    </Paragraph>
                    <Paragraph><Text strong>经验年限:</Text> {geek.YearsOfExperience}</Paragraph>
                </Card>

                <Card title="成就与评分" bordered={false} style={{ marginBottom: 16 }}>
                    <Paragraph><Text strong>解决问题数量:</Text> {geek.SolvedCount}</Paragraph>
                    <Paragraph><Text strong>解决最高难度问题:</Text> {geek.MaxDifficulty}</Paragraph>
                    <Paragraph><Text strong>声誉评分:</Text> {geek.Reputation}</Paragraph>
                    <Paragraph><Text strong>提交次数:</Text> {geek.SubmissionCount}</Paragraph>
                    <Paragraph><Text strong>完成次数:</Text> {geek.CompletionCount}</Paragraph>
                    <Paragraph><Text strong>评价次数:</Text> {geek.ReviewCount}</Paragraph>
                    <Paragraph><Text strong>评分:</Text> {geek.Rating}</Paragraph>
                </Card>
            </Card>
        </div>
    );
};

export default GeekDetail;
