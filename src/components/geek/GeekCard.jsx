import React from 'react';
import { Card, Typography, Avatar, Badge } from 'antd';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './GeekCard.css';

const { Text } = Typography;

const GeekCard = ({ geek, rank }) => {
    const navigate = useNavigate(); // 使用 React Router 的导航功能

    const handleCardClick = () => {
        navigate(`/geeks/${geek.ID}`); // 跳转到详情页
    };

    return (
        <Card
            className={`geek-card hover-card ${
                rank === 1
                    ? 'gold-rank'
                    : rank === 2
                        ? 'silver-rank'
                        : rank === 3
                            ? 'bronze-rank'
                            : ''
            }`}
            onClick={handleCardClick} // 添加点击事件
            hoverable // 卡片可以被悬停高亮
        >
            <div className="geek-card-content">
                {/* 排名徽章 */}
                <Badge
                    count={`#${rank}`}
                    style={{
                        backgroundColor:
                            rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? '#cd7f32' : '#f0f0f0',
                        color: rank < 4 ? '#000' : '#888',
                        fontWeight: rank < 4 ? 'bold' : 'normal',
                    }}
                    className="rank-badge"
                />
                {/* 用户头像 */}
                <Avatar
                    src={geek.Avatar || '/default-avatar.png'}
                    size={64}
                    alt={geek.Username}
                    className="geek-avatar"
                />
                {/* 用户信息 */}
                <div className="geek-info">
                    <Text className="geek-name">{geek.Username}</Text>
                    <Text className="geek-reputation">声誉: {geek.Reputation}</Text>
                    <Text className="geek-solved-count">解决问题: {geek.SolvedCount}</Text>
                    <Text className="geek-skills">技能: {geek.Skills ? geek.Skills.join(', ') : '无'}</Text>
                </div>
            </div>
        </Card>
    );
};

GeekCard.propTypes = {
    geek: PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Username: PropTypes.string.isRequired,
        Avatar: PropTypes.string,
        Reputation: PropTypes.number.isRequired,
        SolvedCount: PropTypes.number.isRequired,
        Skills: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    rank: PropTypes.number.isRequired, // 排名
};

export default GeekCard;

