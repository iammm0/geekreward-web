import React, { useState, useEffect, useContext } from 'react';
import { Table, message, Button, Dropdown, Menu, List } from 'antd';
import { UserContext } from '../contexts/UserContext';
import '../styles/UserBounties.css';
import {getBountyDetail, getReceivedBounties, getUserBounties} from "../services/bounty.js";
import { DownOutlined } from "@ant-design/icons";
import {applyForBounty, getApplicationsByBountyId} from "../services/application.js";
import {useNavigate, useParams} from "react-router-dom";

const UserBounties = () => {
    const { id } = useParams(); // 获取悬赏令的ID
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); // 用于导航
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('published'); // 默认显示发布的悬赏令
    const [applications, setApplications] = useState([]);
    const [bounty, setBounty] = useState(location.state?.bounty || null);

    useEffect(() => {
        if (!bounty) {
            const fetchBounty = async () => {
                try {
                    const data = await getBountyDetail(id);
                    setBounty(data);
                } catch (error) {
                    console.error('Error fetching bounty detail:', error);
                }
            };
            fetchBounty();
        }
    }, [id, bounty]);

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                let data;
                if (selectedType === 'published') {
                    data = await getUserBounties();
                } else {
                    data = await getReceivedBounties();
                }
                setBounties(data);
                setLoading(false);
            } catch (error) {
                message.error('获取悬赏令失败');
                setLoading(false);
            }
        };

        fetchBounties();
    }, [selectedType]);

    useEffect(() => {
        if (selectedType === 'published' && id) {
            const fetchApplications = async () => {
                try {
                    const data = await getApplicationsByBountyId(id);
                    setApplications(data);
                } catch (error) {
                    message.error('获取申请列表失败');
                }
            };

            fetchApplications();
        }
    }, [id, selectedType]);

    const columns = [
        {
            title: '标题',
            dataIndex: 'Title',
            key: 'title',
        },
        {
            title: '描述',
            dataIndex: 'Description',
            key: 'description',
        },
        {
            title: '赏金',
            dataIndex: 'Reward',
            key: 'reward',
        },
        {
            title: '状态',
            dataIndex: 'Status',
            key: 'status',
        },
        {
            title: '截止日期',
            dataIndex: 'Deadline',
            key: 'deadline',
        },
    ];

    const menuItems = [
        {
            key: 'published',
            label: '我发布的悬赏令',
        },
        {
            key: 'received',
            label: '我接收的悬赏令',
        },
    ];

    const handleMenuClick = (e) => {
        setSelectedType(e.key);
    };

    const handleApprove = async (applicationId) => {
        try {
            await applyForBounty(id, applicationId);
            message.success('申请已批准');
            setApplications((prev) => prev.filter((app) => app.id !== applicationId));
        } catch (error) {
            message.error('批准申请失败');
        }
    };

    const handleRowClick = (bounty) => {
        navigate(`/bounties/${bounty.ID}`, { state: { bounty } });
    };

    return (
        <div className="user-bounties-container">
            <h2 className="page-title">我的悬赏令</h2>
            <Dropdown
                overlay={<Menu items={menuItems} onClick={handleMenuClick} />}
                trigger={['hover']}
                className="dropdown"
            >
                <Button>
                    {selectedType === 'published' ? '我发布的悬赏令' : '我接收的悬赏令'} <DownOutlined/>
                </Button>
            </Dropdown>
            <Table
                dataSource={bounties}
                columns={columns}
                loading={loading}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />

            {selectedType === 'published' && (
                <div className="application-list">
                    <h3>悬赏令申请列表</h3>
                    <br></br>
                    <List
                        dataSource={applications}
                        renderItem={(item) => (
                            <List.Item
                                key={item.id}
                                actions={[
                                    // eslint-disable-next-line react/jsx-key
                                    <Button onClick={() => handleApprove(item.id)} type="primary">
                                        批准
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.userName}
                                    description={item.note}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default UserBounties;
