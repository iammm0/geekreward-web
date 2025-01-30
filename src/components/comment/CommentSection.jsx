import { useState, useContext } from 'react';
import { List, Empty, message } from 'antd';
import TextArea from "antd/es/input/TextArea.js";
import PropTypes from "prop-types";
import { UserContext } from "../../contexts/UserContext.jsx";
import CommentCard from "../../contexts/CommentCard.jsx";
import './CommentSection.css';

const CommentSection = ({ comments, loading, onCommentSubmit }) => {
    const { user } = useContext(UserContext);
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
        // 校验
        if (!newComment.trim()) {
            message.error('评论内容不能为空');
            return;
        }
        if (!user) {
            message.error('请先登录以提交评论');
            return;
        }

        const commentData = {
            content: newComment,
            author: user.name,
            createdAt: new Date().toISOString(),
        };
        onCommentSubmit(commentData);

        // 提交后清空输入框
        setNewComment('');
        setCharCount(0);
    };

    // 如果评论输入为空或超出限制、未登录，则禁用提交
    const disabled = !newComment.trim() || charCount > 200 || !user;

    return (
        <div className="comments-section">
            <h3>评论</h3>
            <br />
            <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={comments}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <CommentCard
                            author={item.User.username}
                            avatar={item.User.ProfilePicture}
                            content={item.Content}
                            createdAt={item.CreatedAt}
                        />
                    </List.Item>
                )}
                locale={{ emptyText: <Empty description="暂无评论" /> }}
                loading={loading}
                style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: 16 }}
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

                    {/* 使用箭头区域替代 Button */}
                    <div
                        className={`action-area comment-submit ${disabled ? 'disabled' : ''}`}
                        onClick={() => !disabled && handleCommentSubmit()}
                    >
                        <div className="action-arrow">⬆</div>
                        <div className="action-text">提交评论</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CommentSection.propTypes = {
    comments: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onCommentSubmit: PropTypes.func.isRequired,
};

export default CommentSection;
