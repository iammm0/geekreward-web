import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import {Button, Card, Col, List, message, Rate, Row, Table, Tag, Tooltip, Typography, Spin, Divider, Modal} from 'antd';
import '../styles/BountyDetail.css';
import {getMilestonesByBountyId} from "../services/milestone.js";
import {
    addComment,
    getBountyDetail,
    getComments,
    getUserBountyInteraction,
    likeBounty,
    unlikeBounty
} from "../services/bounty.js";
import {applyForBounty, getApplicationsByBountyId, rejectApplication} from "../services/application.js";
import {CommentOutlined, ExclamationCircleOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import CommentSection from "./CommentSection.jsx";
import dayjs from 'dayjs';
import {UserContext} from "../contexts/UserContext.jsx";

const { Paragraph, Text } = Typography;
const { confirm } = Modal;

const BountyDetail = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);  // 获取用户信息
    const [bounty, setBounty] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingComment, setLoadingComment] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [note, setNote] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bountyData, milestonesData, applicationsData] = await Promise.all([
                    getBountyDetail(id),
                    getMilestonesByBountyId(id),
                    getApplicationsByBountyId(id)
                ]);

                setBounty(bountyData);
                setMilestones(milestonesData);
                setApplicants(applicationsData);
            } catch (error) {
                message.error('获取详情失败');
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setLoadingComment(true);
                const data = await getComments(id);
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
                setUserLiked(interaction.liked);
                setRating(interaction.score || 0);
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
            await applyForBounty(id, note);
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
            const savedComment = await addComment(id, { content });

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

    const handleRate = async (value) => {
        if (!user) {
            message.warning('请先登录以进行操作');
            return;
        }

        try {

            // 更新状态中的评分
            setUserRating(value);
            setRating(value); // 如果需要更新整个悬赏令的评分

            message.success('评分成功');
        } catch (error) {
            message.error('评分失败，请重试');
        }
    };


    const handleApproveApplicant = async (applicantId) => {
        try {
            await applyForBounty(id, applicantId);
            message.success('申请者已成功接收悬赏令');
            setApplicants((prev) => prev.map(applicant =>
                applicant.id === applicantId ? { ...applicant, approved: true } : applicant
            ));
        } catch (error) {
            message.error('批准申请者失败');
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

    const handleRejectApplicant = async (applicationId) => {
        try {
            await rejectApplication(applicationId);

            message.success('已拒绝申请');

            // 更新申请者状态
            setApplicants(prev => prev.filter(applicant => applicant.id !== applicationId));
        } catch (error) {
            message.error('拒绝申请失败，请重试');
        }
    };


    const milestoneColumns = [
        { title: '标题', dataIndex: 'Title', key: 'title', align: 'center'},
        { title: '描述', dataIndex: 'Description', key: 'description', align: 'center'},
        {
            title: '截止日期',
            dataIndex: 'DueDate',
            key: 'dueDate',
            align: 'center',
            render: (text) => dayjs(text).format('YYYY-MM-DD'), // 格式化日期
        },
    ];

    const applicantColumns = [
        { title: '用户名', dataIndex: 'Username', key: 'username', align: 'center',},
        { title: '个人简介', dataIndex: 'Bio', key: 'bio', align: 'center',},
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <>
                    <Button
                        type="primary"
                        disabled={record.approved}
                        onClick={() => showConfirm(
                            '批准申请',
                            `确定要批准用户 ${record.Username} 接收悬赏令吗？`,
                            () => handleApproveApplicant(record.ID)
                        )}
                        style={{ marginRight: 8 }}
                    >
                        {record.approved ? '已接收' : '批准接收'}
                    </Button>
                    <Button
                        type="primary"
                        danger={true}
                        disabled={record.approved}
                        onClick={() => showConfirm(
                            '拒绝申请',
                            `确定要拒绝用户 ${record.Username} 的申请吗？`,
                            () => handleRejectApplicant(record.ID)
                        )}
                    >
                        拒绝接收
                    </Button>
                </>
            ),
        }
    ];

    if (loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    return (
        <div className="page-container">
            <h2 className="page-title">悬赏令详情</h2>
            <Card className="card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="基本信息" bordered={false}>
                            <Paragraph><Text strong>标题:</Text> {bounty.Title}</Paragraph>
                            <Paragraph><Text strong>描述:</Text> {bounty.Description}</Paragraph>
                            <Paragraph><Text strong>赏金:</Text> {bounty.Reward} 元</Paragraph>
                            <Paragraph><Text strong>状态:</Text> {bounty.Status}</Paragraph>
                            <Paragraph><Text strong>截止日期:</Text> {new Date(bounty.Deadline).toLocaleDateString()}</Paragraph>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="附加信息" bordered={false}>
                            <Paragraph><Text strong>难度等级:</Text> {bounty.DifficultyLevel}</Paragraph>
                            <Paragraph><Text strong>类别:</Text> {bounty.Category}</Paragraph>
                            <Paragraph><Text strong>标签:</Text> {bounty.Tags ? bounty.Tags.map(tag => <Tag key={tag}>{tag}</Tag>) : '无'}</Paragraph>
                            <Paragraph><Text strong>所在地:</Text> {bounty.Location}</Paragraph>
                            <Paragraph><Text strong>附件链接:</Text> {bounty.AttachmentUrls ? bounty.AttachmentUrls.join(', ') : '无'}</Paragraph>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{marginTop: 16}}>
                    <Col span={12}>
                        <Card title="统计数据" bordered={false}>
                            <Paragraph><Text strong>查看次数:</Text> {bounty.ViewCount}</Paragraph>
                            <Paragraph><Text strong>提交次数:</Text> {bounty.SubmissionCount}</Paragraph>
                            <Paragraph><Text strong>评论次数:</Text> {bounty.CommentsCount}</Paragraph>
                            <Paragraph><Text strong>评分:</Text> {bounty.Rating}</Paragraph>
                            <Paragraph><Text strong>评价次数:</Text> {bounty.ReviewCount}</Paragraph>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="其他信息" bordered={false}>
                            <Paragraph><Text strong>匿名:</Text> {bounty.Anonymous ? '是' : '否'}</Paragraph>
                            <Paragraph><Text strong>优先级:</Text> {bounty.Priority}</Paragraph>
                            <Paragraph><Text strong>预算:</Text> {bounty.Budget}</Paragraph>
                            <Paragraph><Text strong>付款状态:</Text> {bounty.PaymentStatus}</Paragraph>
                            <Paragraph><Text strong>合同类型:</Text> {bounty.ContractType}</Paragraph>
                        </Card>
                    </Col>
                </Row>

                <Card title="里程碑详情" bordered={false} style={{marginTop: 16}}>
                    <Table dataSource={milestones} columns={milestoneColumns} loading={loading} rowKey="id" />
                </Card>

                <Card title="悬赏申请者" bordered={false} style={{marginTop: 16}}>
                    <Table dataSource={applicants} columns={applicantColumns} loading={loading} rowKey="id" />
                </Card>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
                    <Button
                        onClick={() => showConfirm(
                            '申请接收悬赏令',
                            '确定要申请接收这个悬赏令吗？',
                            handleApply
                        )}
                        type="primary"
                    >
                        申请接收悬赏
                    </Button>
                </div>
            </Card>

            <Card className="card" style={{ marginTop: 32 }}>
                <div className="stats-container">
                    <Tooltip title={userLiked ? "取消点赞" : "点赞"}>
                        <Button
                            type="text"
                            icon={userLiked ? <LikeFilled /> : <LikeOutlined />}
                            onClick={handleLike}
                        >
                            {bounty.likesCount}
                        </Button>
                    </Tooltip>
                    <Tooltip title="评分">
                        <Rate value={userRating} onChange={handleRate} />
                        <span style={{ marginLeft: 8 }}>{rating} 分</span>
                    </Tooltip>
                    <Tooltip title="评论">
                        <Button type="text" icon={<CommentOutlined/>}>
                            {comments.length}
                        </Button>
                    </Tooltip>
                </div>

                <Divider />

                <CommentSection
                    comments={comments}
                    loading={loadingComment}
                    onCommentSubmit={handleCommentSubmit}
                />
            </Card>
        </div>
    );
};

export default BountyDetail;
