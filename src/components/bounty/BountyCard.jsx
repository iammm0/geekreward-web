import React from 'react';
import {Card, Divider, Typography} from 'antd';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import './BountyCard.css';
import {ClockCircleOutlined, DollarCircleOutlined} from "@ant-design/icons";
import BountyDescription from "./BountyDescription.jsx";

const { Text, Paragraph } = Typography;

const BountyCard = ({ bounty }) => {
    const navigate = useNavigate();

    const MAX_TITLE_LENGTH = 20; // 限制标题字数

    // 根据难度等级动态设置卡片背景颜色
    const getCardStyleByDifficulty = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "简单":
                return { backgroundColor: "#e8f5e9" }; // 浅绿色
            case "中等":
                return { backgroundColor: "#fff8e1" }; // 浅黄色
            case "困难":
                return { backgroundColor: "#ffebee" }; // 浅红色
            case "专家":
                return { backgroundColor: "#ede7f6" }; // 浅紫色
            default:
                return { backgroundColor: "#f5f5f5" }; // 默认灰色
        }
    };

    // 截断文本
    const truncateText = (text, maxLength) =>
        text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

    return (
        <Card
            className="bounty-card hover-card"
            hoverable
            onClick={() => navigate(`/bounties/${bounty.ID}`)}
            style={getCardStyleByDifficulty(bounty.DifficultyLevel)}
        >
            <div className="bounty-header">
                <Text className="bounty-title">
                    {truncateText(bounty.Title, MAX_TITLE_LENGTH)}
                </Text>
            </div>
            <div className="bounty-body">
                <div className="bounty-info">
                    <DollarCircleOutlined className="bounty-icon"/>
                    <Text className="bounty-reward"> {bounty.Reward} 元</Text>
                </div>
                <div className="bounty-info">
                    <ClockCircleOutlined className="bounty-icon"/>
                    <Text className="bounty-deadline">
                        {bounty.Deadline && bounty.Deadline !== "0001-01-01T08:00:00+08:00"
                            ? new Date(bounty.Deadline).toLocaleDateString()
                            : "未设置"}
                    </Text>
                </div>
            </div>
            <Divider/>
            <BountyDescription description={bounty.Description} maxLength={80} />
        </Card>
    );
};


BountyCard.propTypes = {
    bounty: PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Reward: PropTypes.number.isRequired,
        Deadline: PropTypes.string,
        DifficultyLevel: PropTypes.string,
        Status: PropTypes.string.isRequired,
    }).isRequired,
};

export default BountyCard;