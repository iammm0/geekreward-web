import { useState, useEffect, useContext } from 'react';
import {Table, Dropdown, Button, Menu, message, Tag} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext.jsx';
import { getBountiesByFilter } from '../../../services/bounty.js';
import './UserBountiesScreen.css';
import {getUserInfo} from "../../../services/user.js";
import dayjs from "dayjs";

const UserBountiesScreen = () => {
    const { user } = useContext(UserContext); // 获取当前用户
    const [bounties, setBounties] = useState([]); // 悬赏令列表
    const [loading, setLoading] = useState(false); // 加载状态
    const [selectedType, setSelectedType] = useState('published'); // 当前显示的悬赏类型
    const navigate = useNavigate(); // 路由导航

    //================= useEffect: 当 selectedType 或 user 改变时触发 =================
    useEffect(() => {
        // 如果 user 不存在，或者 user.ID 不存在，就不请求
        if (!user || !user.ID) {
            return;
        }

        // 发请求
        const fetchData = async () => {
            setLoading(true);
            try {
                const filters = {
                    limit: 10,
                    offset: 0,
                    ...(selectedType === 'published'
                        ? { publisher_id: user.ID }
                        : { receiver_id: user.ID }),
                };

                console.log('Filters for fetching bounties:', filters);

                const data = await getBountiesByFilter(filters);
                console.log('Fetched bounties:', data);
                setBounties(data);
            } catch (error) {
                console.error('Error fetching bounties:', error);
                message.error('加载悬赏令失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedType, user]); // 注意这里不再依赖 fetchBounties


    //================= 行点击，跳转到相应详情 =================
    const handleRowClick = (bounty) => {
        if (selectedType === 'published') {
            navigate(`/publisher-bounty-detail/${bounty.ID}`);
        } else {
            navigate(`/applicant-bounty-management/${bounty.ID}`);
        }
    };

    //================= 切换悬赏类型 =================
    const handleMenuClick = ({ key }) => {
        setSelectedType(key);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="published">我发布的悬赏令</Menu.Item>
            <Menu.Item key="received">我接收的悬赏令</Menu.Item>
        </Menu>
    );

    //================= 渲染 =================

    // 状态标签映射
    const statusMap = {
        approved: { text: '已批准', color: 'green' },
        rejected: { text: '已拒绝', color: 'red' },
        pending: { text: '待审核', color: 'orange' },
        in_progress: { text: '进行中', color: 'blue' },
        completed: { text: '已完成', color: 'cyan' },
        default: { text: '处理中', color: 'geekblue' },
    };

    return (
        <div className="user-bounties-container">
            <h2>我的悬赏令</h2>

            {/* 下拉菜单 */}
            <Dropdown
                overlay={
                    <Menu onClick={handleMenuClick}>
                        <Menu.Item key="published">我发布的悬赏令</Menu.Item>
                        <Menu.Item key="received">我接收的悬赏令</Menu.Item>
                    </Menu>
                }
            >
                <Button>
                    {selectedType === 'published' ? '我发布的悬赏令' : '我接收的悬赏令'} <DownOutlined />
                </Button>
            </Dropdown>

            {/* 悬赏令表格 */}
            <Table
                dataSource={bounties}
                columns={[
                    { title: '标题', dataIndex: 'Title', key: 'title' },
                    { title: '赏金', dataIndex: 'Reward', key: 'reward' },
                    {
                        title: '状态',
                        dataIndex: 'Status',
                        key: 'status',
                        render: (status) => {
                            const { text, color } = statusMap[status] || statusMap.default;
                            return <Tag color={color}>{text}</Tag>;
                        },
                    },
                    {
                        title: '截止日期',
                        dataIndex: 'Deadline',
                        key: 'deadline',
                        render: (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '无截止日期'),
                    },
                ]}
                rowKey="ID"
                loading={loading}
                onRow={(bounty) => ({
                    onClick: () => handleRowClick(bounty),
                })}
            />
        </div>
    );
};

export default UserBountiesScreen;
