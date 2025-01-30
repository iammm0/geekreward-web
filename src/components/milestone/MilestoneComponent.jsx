// src/components/MilestoneComponent.jsx
import React, { useState, useEffect } from "react";
import {Table, Button, message, Modal, Form, Input, Popconfirm, Divider} from "antd";
import "./MilestoneComponent.css";
import PropTypes from "prop-types";
import {createMilestone, deleteMilestone, getMilestonesByBountyID, updateMilestone} from "../../services/milestone.js"; // 导入样式

const MilestoneComponent = ({ bountyId, refreshBounty }) => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [form] = Form.useForm();

    // 获取里程碑数据
    const fetchMilestones = async () => {
        setLoading(true);
        try {
            const data = await getMilestonesByBountyID(bountyId);
            setMilestones(data);
        } catch (error) {
            console.error("加载里程碑失败:", error);
            message.error("加载里程碑失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bountyId) {
            fetchMilestones();
        }
    }, [bountyId]);

    // 打开创建里程碑弹窗
    const showCreateModal = () => {
        setIsEditMode(false);
        setCurrentMilestone(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    // 打开编辑里程碑弹窗
    const showEditModal = (milestone) => {
        setIsEditMode(true);
        setCurrentMilestone(milestone);
        form.setFieldsValue({
            title: milestone.Title,
            description: milestone.Description,
            due_date: milestone.Due_date ? milestone.Due_date.split("T")[0] : "",
        });
        setIsModalVisible(true);
    };

    // 处理创建或编辑里程碑
    const handleOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    if (isEditMode && currentMilestone) {
                        // 编辑里程碑
                        const updatedMilestone = await updateMilestone(
                            currentMilestone.ID,
                            bountyId,
                            {
                                Title: values.title,
                                Description: values.description,
                                Due_date: new Date(values.due_date).toISOString(),
                            }
                        );
                        setMilestones((prev) =>
                            prev.map((m) => (m.ID === updatedMilestone.ID ? updatedMilestone : m))
                        );
                        message.success("里程碑更新成功");
                        setIsModalVisible(false);
                        setCurrentMilestone(null);
                    } else {
                        // 创建里程碑
                        const newMilestone = await createMilestone(bountyId, {
                            Title: values.title,
                            Description: values.description,
                            Due_date: new Date(values.due_date).toISOString(),
                        });
                        setMilestones((prev) => [...prev, newMilestone]);
                        message.success("里程碑创建成功");
                        setIsModalVisible(false);
                        form.resetFields();
                        if (refreshBounty) {
                            refreshBounty(); // 可选：刷新悬赏令详情以反映里程碑数量变化
                        }
                    }
                } catch (error) {
                    console.error(isEditMode ? "更新里程碑失败:" : "创建里程碑失败:", error);
                    message.error(isEditMode ? "更新里程碑失败，请稍后重试" : "创建里程碑失败，请稍后重试");
                }
            })
            .catch((info) => {
                console.error("表单验证失败:", info);
            });
    };

    // 处理取消操作
    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentMilestone(null);
        form.resetFields();
    };

    // 处理删除里程碑
    const handleDelete = async (milestoneId) => {
        try {
            await deleteMilestone(milestoneId, bountyId);
            setMilestones((prev) => prev.filter((m) => m.ID !== milestoneId));
            message.success("里程碑删除成功");
            if (refreshBounty) {
                refreshBounty(); // 可选：刷新悬赏令详情
            }
        } catch (error) {
            console.error("删除里程碑失败:", error);
            message.error("删除里程碑失败，请稍后重试");
        }
    };

    // 定义里程碑表格列
    const columns = [
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            align: "center",
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
            align: "center",
        },
        {
            title: "截止日期",
            dataIndex: "due_date",
            key: "due_date",
            align: "center",
            render: (text) => (text ? new Date(text).toLocaleDateString() : "无"),
        },
        {
            title: "提交状态",
            dataIndex: "is_completed",
            key: "is_completed",
            align: "center",
            render: (isCompleted) => (isCompleted ? "已提交" : "未提交"),
        },
        {
            title: "操作",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => showEditModal(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除此里程碑吗？"
                        onConfirm={() => handleDelete(record.ID)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="milestone-component-container">
            <Divider>里程碑管理</Divider>
            <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                创建里程碑
            </Button>
            <Table
                dataSource={milestones}
                columns={columns}
                rowKey="ID"
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
                locale={{ emptyText: "暂无里程碑" }}
            />

            {/* 创建/编辑里程碑 Modal */}
            <Modal
                title={isEditMode ? "编辑里程碑" : "创建里程碑"}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditMode ? "更新" : "创建"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[{ required: true, message: "请输入标题" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                        rules={[{ required: true, message: "请输入描述" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="due_date"
                        label="截止日期"
                        rules={[{ required: true, message: "请输入截止日期" }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

MilestoneComponent.propTypes = {
    /** 悬赏令的唯一标识符 */
    bountyId: PropTypes.string.isRequired,
    /** 刷新悬赏令详情的回调函数 */
    refreshBounty: PropTypes.func, // 可选
};

MilestoneComponent.defaultProps = {
    refreshBounty: () => {},
};

export default MilestoneComponent;
