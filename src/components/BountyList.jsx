import React, { useState, useEffect } from 'react';
import { List, Card, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import '../styles/BountyList.css';
import {getBounties} from "../services/bounty.js";

const { Text, Paragraph } = Typography;

/**
 * @typedef {import('../models/BountyDTO.js').Bounty} Bounty
 */

const BountyList = () => {
    const [bounties, setBounties] = useState([]);

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const data = await getBounties();
                console.log('Fetched bounties:', data); // 打印获取的数据
                setBounties(data);
            } catch (error) {
                console.error('Error fetching bounties:', error);
            }
        };
        fetchBounties();
    }, []);

    return (
        <div className="bounty-list-container">
            <List
                grid={{ gutter: 24, column: 3 }}
                dataSource={bounties}
                renderItem={bounty => (
                    <List.Item key={bounty.ID}>
                        <div className="card-content">
                            <Card title={bounty.Title} className="card">
                                <Paragraph>{bounty.Description}</Paragraph>
                                <Text>悬赏金额: {bounty.Reward} 元</Text><br/>
                                <Text>截止日期: {bounty.Deadline && bounty.Deadline !== "0001-01-01T08:00:00+08:00" ? new Date(bounty.Deadline).toLocaleDateString() : "未设置"}</Text><br/>
                                <Text>难度等级: {bounty.DifficultyLevel || "未设置"}</Text><br/>
                                <Text>状态: {bounty.Status}</Text><br/>
                                <Link to={`/bounties/${bounty.ID}`}>查看详情</Link>
                            </Card>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default BountyList;
