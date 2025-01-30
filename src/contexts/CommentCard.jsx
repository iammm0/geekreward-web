import React, {useContext} from 'react';
import { Card, Typography } from 'antd';
import PropTypes from 'prop-types';
import './CommentCard.css';
import {UserContext} from "./UserContext.jsx"; // 引入样式文件

const { Text } = Typography;

const CommentCard = ({content, createdAt,}) => {
    const {user} = useContext(UserContext); // 获取当前用户信息

    // 从当前用户信息中取值，如果未登录，则使用默认值
    const author = user?.name;

    return (
        <Card className="comment-card" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginLeft: '16px' }}>
                    <Text strong>{author}</Text>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(createdAt).toLocaleString()}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <Text>{content}</Text>
                    </div>
                </div>
            </div>
        </Card>
    );
};

CommentCard.propTypes = {
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
};

export default CommentCard;
