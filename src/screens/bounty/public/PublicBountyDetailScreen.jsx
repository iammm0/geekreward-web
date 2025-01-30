import {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import {message, Spin, Divider, Modal} from 'antd';
import './PublicBountyDetailScreen.css';
import {
    commentOnBounty,
    getBounty,
    getBountyComments,
    getUserBountyInteraction,
    likeBounty,
    unlikeBounty
} from "../../../services/bounty.js";
import {
    ExclamationCircleOutlined
} from "@ant-design/icons";
import CommentSection from "../../../components/comment/CommentSection.jsx";
import {UserContext} from "../../../contexts/UserContext.jsx";
import Statistics from "../../../components/bounty/Statistics.jsx";
import BountyBasicInfo from "../../../components/bounty/BountyBasicInfo.jsx";
import AdditionalInfo from "../../../components/bounty/AdditionalInfo.jsx";
import OtherInfo from "../../../components/bounty/OtherInfo.jsx";
import {createApplication} from "../../../services/application.js";
import PublicApplicationDisplay from "../../../components/application/PublicApplicationDisplay.jsx";

const { confirm } = Modal;

const PublicBountyDetailScreen = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);  // 获取用户信息
    const [bounty, setBounty] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingComment, setLoadingComment] = useState(false);
    const [userLiked, setUserLiked] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bountyData,] = await Promise.all([
                    getBounty(id),
                ]);

                setBounty(bountyData);
            } catch (error) {
                message.error('获取详情失败');
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setLoadingComment(true);
                const data = await getBountyComments(id);
                setComments(data);
            } catch (error) {
                message.error('获取评论失败');
            } finally {
                setLoadingComment(false);
            }
        };

        const fetchUserInteraction = async () => {
            try {
                const interaction = await getUserBountyInteraction(id);
                setUserLiked(interaction.score);
            } catch (error) {
                message.error('无法加载用户交互信息');
            }
        };

        fetchData();
        fetchComments();
        fetchUserInteraction();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            message.warning('请先登录以进行操作');
            return;
        }

        try {
            if (userLiked) {
                await unlikeBounty(id);
                message.success('取消点赞成功');
                setBounty(prev => ({ ...prev, likesCount: prev.likesCount - 1 }));
            } else {
                await likeBounty(id);
                message.success('点赞成功');
                setBounty(prev => ({ ...prev, likesCount: prev.likesCount + 1 }));
            }
            setUserLiked(!userLiked);
        } catch (error) {
            message.error('操作失败，请重试');
        }
    };


    const handleApply = async () => {
        if (!user) {
            message.warning('请先登录以进行操作');
            return;
        }

        try {
            await createApplication(id);
            message.success('申请已提交');
        } catch (error) {
            message.error('申请提交失败');
        }
    };

    const handleCommentSubmit = async (commentData) => {
        const { content } = commentData;

        if (!user) {
            message.warning('请先登录以进行操作');
            return;
        }

        // 检查评论内容是否为空
        if (!content.trim()) {
            message.error('评论内容不能为空');
            return;
        }

        // 检查评论字符数是否超过限制
        if (content.length > 200) {
            message.error('评论内容不能超过200个字符');
            return;
        }

        try {
            // 调用API，传递content字段
            const savedComment = await commentOnBounty(id, { content });

            // 在前端添加完整的评论对象
            const newComment = {
                Content: savedComment.Content, // 从服务器返回的数据中获取
                User: {
                    Name: user.name,
                    Avatar: user.avatar,
                },
                CreatedAt: new Date().toISOString(), // 设置当前时间
            };

            setComments((prevComments) => [...prevComments, newComment]);
            message.success('评论提交成功');
        } catch (error) {
            message.error('评论提交失败，请重试');
        }
    };

    const showConfirm = (title, content, onOk) => {
        confirm({
            title: title,
            content: content,
            icon: <ExclamationCircleOutlined />,
            onOk() {
                onOk();
            },
            onCancel() {
                message.info('操作已取消');
            },
            style: { top: 320 } // 调整确认框距离顶部的距离
        });
    };

    if (loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    return (
        <div className="page-container fade-in-container">
            <div
                className="action-area action-left"
                onClick={handleLike}
            >
                <div className="action-arrow">→</div>
                <div className="action-text">
                    {userLiked ? "取消点赞" : "点赞悬赏令"}
                </div>
            </div>

            <div className="main-content">
                {/* 悬赏令基本信息 */}
                <BountyBasicInfo
                    title={bounty.Title}
                    description={bounty.Description}
                    reward={bounty.Reward}
                    deadline={bounty.Deadline}
                />

                <Divider/>

                {/* 附加信息 */}
                <AdditionalInfo
                    difficulty={bounty.DifficultyLevel}
                    category={bounty.Category}
                    tags={bounty.Tags}
                    location={bounty.Location}
                    attachmentUrls={bounty.AttachmentUrls}
                />

                <Divider/>

                <Statistics
                    viewCount={bounty.ViewCount}
                    commentCount={bounty.CommentsCount}
                    submissionCount={bounty.submissionCount ?? 0}
                    rating={bounty.rating ?? 0}
                />

                <Divider/>

                <OtherInfo bounty={bounty}/>

                <PublicApplicationDisplay bountyId={bounty.ID}></PublicApplicationDisplay>

                {/* 评论区 */}
                <Divider/>

                <CommentSection
                    comments={comments}
                    loading={loadingComment}
                    onCommentSubmit={handleCommentSubmit}
                />
            </div>

            <div
                className="action-area action-right"
                onClick={() =>
                    showConfirm(
                        "申请接收悬赏令",
                        "确定要申请接收这个悬赏令吗？",
                        handleApply
                    )
                }
            >
                <div className="action-arrow">←</div>
                <div className="action-text">申请接受悬赏令</div>
            </div>
        </div>
    );
};

PublicBountyDetailScreen.propTypes = {

};

export default PublicBountyDetailScreen;
