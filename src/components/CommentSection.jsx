import React, { useState, useContext } from 'react';
import { List, Empty, Button, message } from 'antd';
import TextArea from "antd/es/input/TextArea.js";
import CommentCard from "../contexts/CommentCard.jsx";
import PropTypes from "prop-types";
import { UserContext } from "../contexts/UserContext.jsx"; // 引入UserContext

const CommentSection = ({ comments, loading, onCommentSubmit }) => {
    const { user } = useContext(UserContext); // 获取当前用户信息
    const [newComment, setNewComment] = useState('');
    const [charCount, setCharCount] = useState(0);

    const handleCommentChange = (e) => {
        const value = e.target.value;
        if (value.length <= 200) {
            setNewComment(value);
            setCharCount(value.length);
        }
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) {
            message.error('评论内容不能为空');
            return;
        }

        if (!user) {
            message.error('请先登录以提交评论');
            return;
        }

        // 使用当前用户信息和评论内容创建评论数据
        const commentData = {
            content: newComment,
            author: user.name,  // 使用 user 中的用户名
            avatar: user.avatar,  // 使用 user 中的头像
            createdAt: new Date().toISOString()  // 添加创建时间
        };

        onCommentSubmit(commentData);  // 将处理交给父组件 BountyDetail
        setNewComment('');
        setCharCount(0);
    };


    return (
        <div className="comments-section">
            <h3>评论</h3><br />
            <List
                grid={{ gutter: 24, column: 2 }}
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <CommentCard
                            author={item.User?.Name || '匿名用户'}
                            avatar={item.User?.Avatar || '/specialist.svg'}
                            content={item.Content}
                            createdAt={item.CreatedAt}
                        />
                    </List.Item>
                )}
                locale={{ emptyText: <Empty description="暂无评论" /> }}
                loading={loading}
            />
            <div className="comment-input-container">
                <TextArea
                    rows={4}
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="请输入评论..."
                />
                <div className="comment-footer">
                    <span className="char-count">{charCount}/200</span>
                    <Button
                        type="primary"
                        onClick={handleCommentSubmit}
                        disabled={charCount > 200}
                    >
                        提交评论
                    </Button>
                </div>
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    comments: PropTypes.array.isRequired, // comments 是数组，必填
    loading: PropTypes.bool.isRequired,   // loading 是布尔值，必填
    onCommentSubmit: PropTypes.func.isRequired, // onCommentSubmit 是函数，必填
};

export default CommentSection;
