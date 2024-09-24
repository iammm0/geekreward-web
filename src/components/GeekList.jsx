import React, { useState, useEffect } from 'react';
import { List, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import '../styles/GeekList.css';
import {getGeeks} from "../services/geek.js";

const { Text, Paragraph } = Typography;

/**
 * @typedef {import('../models/UserDTO.js').User} User
 */

const GeekList = () => {
    const [geeks, setGeeks] = useState(/** @type {User[]} */ ([]));

    useEffect(() => {
        const fetchGeeks = async () => {
            try {
                const data = await getGeeks();
                setGeeks(data);
            } catch (error) {
                console.error('Error fetching geeks:', error);
            }
        };
        fetchGeeks();
    }, []);

    return (
        <div className="geek-list-container">
            <List
                grid={{ gutter: 24, column: 3 }}
                dataSource={geeks}
                renderItem={geek => (
                    <List.Item key={geek.ID}>
                        <Card title={geek.Username} className="geek-list-card">
                            <div className="card-content">
                                <Text>姓名:{geek.FirstName} {geek.LastName}</Text><br/>
                                <Text>声誉:{geek.Reputation}</Text><br/>
                                <Text>解决问题数量:{geek.SolvedCount}</Text><br/>
                                <Text>技能:{geek.Skills ? geek.Skills.join(', ') : '无'}</Text><br/>
                                <Link to={`/geeks/${geek.ID}`}>查看详情</Link>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default GeekList;
