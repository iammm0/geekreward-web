// src/components/ApplicationTable.jsx
import React from "react";
import { Table, Button, Popconfirm } from "antd";
import PropTypes from "prop-types";

const ApplicationTable = ({ applications, loading, onApprove, onReject, isPublisher }) => {
    const columns = [
        {
            title: "申请者",
            dataIndex: ["User", "Username"], // 确保数据路径正确
            key: "username",
            align: "center"
        },
        {
            title: "备注",
            dataIndex: "Note",
            key: "note",
            align: "center"
        },
        {
            title: "申请时间",
            dataIndex: "CreatedAt",
            key: "createdAt",
            align: "center",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "状态",
            dataIndex: "Status",
            key: "status",
            align: "center",
            render: (status) => {
                let color = "geekblue";
                let text = "待处理"; // 默认状态

                if (status === "approved") {
                    color = "green";
                    text = "已批准";
                } else if (status === "rejected") {
                    color = "red";
                    text = "已拒绝";
                }

                return <span style={{ color }}>{text}</span>;
            }
        },
    ];

    if (isPublisher) {
        columns.push({
            title: "操作",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <>
                    {record.Status === "pending" && (
                        <>
                            <Button
                                type="primary"
                                onClick={() => onApprove(record.ID)}
                            >
                                批准
                            </Button>
                            <Popconfirm
                                title="确定要拒绝此申请吗？"
                                onConfirm={() => onReject(record.ID)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button danger style={{ marginLeft: 8 }}>
                                    拒绝
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </>
            ),
        });
    }

    return (
        <Table
            dataSource={applications}
            columns={columns}
            rowKey="ID" // 确保每个申请都有唯一的 ID
            loading={loading}
            pagination={{ pageSize: 5 }}
            bordered
            locale={{ emptyText: "暂无申请" }}
        />
    );
};

ApplicationTable.propTypes = {
    /** 申请数据数组 */
    applications: PropTypes.arrayOf(PropTypes.shape({
        ID: PropTypes.string.isRequired,
        Note: PropTypes.string,
        BountyID: PropTypes.string.isRequired,
        Status: PropTypes.oneOf(['pending', 'approved', 'rejected']).isRequired,
        User: PropTypes.shape({
            username: PropTypes.string.isRequired,
            profilePicture: PropTypes.string, // 如果需要显示头像
        }).isRequired,
        CreatedAt: PropTypes.string.isRequired,
        UpdatedAt: PropTypes.string.isRequired,
    })).isRequired,
    /** 表格加载状态 */
    loading: PropTypes.bool,
    /** 批准申请的回调函数 */
    onApprove: PropTypes.func,
    /** 拒绝申请的回调函数 */
    onReject: PropTypes.func,
    /** 是否为发布者，决定是否显示操作按钮 */
    isPublisher: PropTypes.bool,
};

ApplicationTable.defaultProps = {
    loading: false,
    onApprove: () => {},
    onReject: () => {},
    isPublisher: false,
};


export default ApplicationTable;
