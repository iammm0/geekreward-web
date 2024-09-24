import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const CommentCard = ({
                         author = '匿名用户',
                         avatar = '/default-avatar.png',
                         content,
                         createdAt
                     }) => (
    <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={avatar} alt={author} />
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

CommentCard.propTypes = {
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
};


export default CommentCard;
