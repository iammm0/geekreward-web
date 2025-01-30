import { useState, useEffect } from "react";
import {Button, message, Divider, Form, Modal, Input} from "antd";
import {getMilestonesByBountyID} from "../../../services/milestone.js";
import {useParams} from "react-router-dom";
import {getBounty, updateBounty} from "../../../services/bounty.js";
import "./PublisherBountyDetailScreen.css"
import MilestoneComponent from "../../../components/milestone/MilestoneComponent.jsx";
import PublisherApplicationManager from "../../../components/application/PublisherApplicationManager.jsx";
import {getPrivateApplicationsByBountyId} from "../../../services/application.js";

const PublisherBountyDetailScreen = () => {
    const { id: bountyId } = useParams(); // 从路由获取 bountyId
    const [bounty, setBounty] = useState(null); // 悬赏令详情
    const [applications, setApplications] = useState([]); // 申请列表
    const [milestones, setMilestones] = useState([]); // 里程碑列表
    const [loading, setLoading] = useState(true); // 全局加载状态

    const [form] = Form.useForm();

    useEffect(() => {
        if (!bountyId) {
            message.error("无法获取悬赏令 ID，请检查 URL");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // 同时加载悬赏令、申请列表和里程碑
                const [bountyData, applicationsData, milestonesData] = await Promise.all([
                    getBounty(bountyId),
                    getPrivateApplicationsByBountyId(bountyId),
                    getMilestonesByBountyID(bountyId),
                ]);

                setBounty(bountyData);
                setApplications(applicationsData);
                setMilestones(milestonesData);
            } catch (error) {
                console.error("加载悬赏令数据失败:", error);
                message.error("加载悬赏令数据失败，请稍后重试");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bountyId]);

    // 更新悬赏令某条信息
    const handleUpdateBountyField = async (field, value) => {
        try {
            const updates = {};
            updates[field] = value;
            const updatedBounty = await updateBounty(bountyId, updates);
            setBounty((prev) => ({ ...prev, ...updatedBounty }));
            message.success(`${field} 更新成功`);
        } catch (error) {
            console.error(`${field} 更新失败:`, error);
            message.error("更新失败，请稍后重试");
        }
    };

    return (
        <div className="publisher-bounty-detail-container">
            {/* 悬赏令信息 */}
            <Divider>悬赏令信息</Divider>
            <div className="bounty-info-container">
                <p>
                    <strong>标题:</strong> {bounty?.Title || "无"}{" "}
                    <Button
                        size="small"
                        onClick={() => {
                            Modal.confirm({
                                title: "更新标题",
                                content: (
                                    <Form form={form} layout="vertical">
                                        <Form.Item
                                            name="Title"
                                            label="新标题"
                                            rules={[{ required: true, message: "请输入新标题" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Form>
                                ),
                                onOk: () => {
                                    form.validateFields()
                                        .then((values) => {
                                            handleUpdateBountyField("Title", values.Title);
                                        })
                                        .catch((info) => console.error("验证失败:", info));
                                },
                            });
                        }}
                    >
                        更新
                    </Button>
                </p>
                <p>
                    <strong>描述:</strong> {bounty?.Description || "无"}{" "}
                    <Button
                        size="small"
                        onClick={() => {
                            Modal.confirm({
                                title: "更新描述",
                                content: (
                                    <Form form={form} layout="vertical">
                                        <Form.Item
                                            name="Description"
                                            label="新描述"
                                            rules={[{ required: true, message: "请输入新描述" }]}
                                        >
                                            <Input.TextArea rows={3} />
                                        </Form.Item>
                                    </Form>
                                ),
                                onOk: () => {
                                    form.validateFields()
                                        .then((values) => {
                                            handleUpdateBountyField("Description", values.Description);
                                        })
                                        .catch((info) => console.error("验证失败:", info));
                                },
                            });
                        }}
                    >
                        更新
                    </Button>
                </p>
                <p>
                    <strong>赏金:</strong> {bounty?.Reward || "无"} 元{" "}
                    <Button
                        size="small"
                        onClick={() => {
                            Modal.confirm({
                                title: "更新赏金",
                                content: (
                                    <Form form={form} layout="vertical">
                                        <Form.Item
                                            name="Reward"
                                            label="新赏金"
                                            rules={[
                                                { required: true, message: "请输入新赏金" },
                                                { type: "number", min: 0, message: "赏金不能为负数" },
                                            ]}
                                        >
                                            <Input type="number" />
                                        </Form.Item>
                                    </Form>
                                ),
                                onOk: () => {
                                    form.validateFields()
                                        .then((values) => {
                                            handleUpdateBountyField("Reward", Number(values.Reward));
                                        })
                                        .catch((info) => console.error("验证失败:", info));
                                },
                            });
                        }}
                    >
                        更新
                    </Button>
                </p>
                <p>
                    <strong>截止日期:</strong> {new Date(bounty?.Deadline).toLocaleDateString() || "无"}{" "}
                    <Button
                        size="small"
                        onClick={() => {
                            Modal.confirm({
                                title: "更新截止日期",
                                content: (
                                    <Form form={form} layout="vertical">
                                        <Form.Item
                                            name="Deadline"
                                            label="新截止日期"
                                            rules={[{ required: true, message: "请输入新截止日期" }]}
                                        >
                                            <Input type="date" />
                                        </Form.Item>
                                    </Form>
                                ),
                                onOk: () => {
                                    form.validateFields()
                                        .then((values) => {
                                            handleUpdateBountyField("Deadline", values.Deadline);
                                        })
                                        .catch((info) => console.error("验证失败:", info));
                                },
                            });
                        }}
                    >
                        更新
                    </Button>
                </p>
                <p>
                    <strong>发布者:</strong> {bounty?.Publisher || "无"}
                </p>
                <p>
                    <strong>状态:</strong> {bounty?.Status || "无"}
                </p>
            </div>

            {/* 申请信息展示 */}
            <PublisherApplicationManager bountyId={bountyId} />

            {/* 里程碑展示（如果需要） */}
            <MilestoneComponent bountyId={bountyId} />
        </div>
    );
};

export default PublisherBountyDetailScreen;
