import React, { useState, useEffect } from "react";
import { Divider, message, Form } from "antd";
import ApplicationTable from "./ApplicationTable.jsx";
import PropTypes from "prop-types";
import {
    approveApplication,
    getPrivateApplicationsByBountyId,
    rejectApplication
} from "../../services/application.js";

const PublisherApplicationManager = ({ bountyId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    // 获取申请数据
    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await getPrivateApplicationsByBountyId(bountyId);
            // 过滤掉无效的数据
            const validApplications = data.filter(app => app.ID && app.User && app.User.Username);
            setApplications(validApplications);
        } catch (error) {
            console.error("加载申请数据失败:", error);
            message.error("加载申请数据失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bountyId) {
            fetchApplications();
        }
    }, [bountyId]);

    // 处理批准申请
    const handleApprove = async (applicationId) => {
        try {
            await approveApplication(applicationId);
            message.success("申请已批准");
            setApplications(prev => prev.filter(app => app.ID !== applicationId));
        } catch (error) {
            console.error("批准申请失败:", error);
            message.error("批准申请失败，请稍后重试");
        }
    };

    // 处理拒绝申请
    const handleReject = async (applicationId) => {
        try {
            await rejectApplication(applicationId);
            message.success("申请已拒绝");
            setApplications(prev => prev.filter(app => app.ID !== applicationId));
        } catch (error) {
            console.error("拒绝申请失败:", error);
            message.error("拒绝申请失败，请稍后重试");
        }
    };

    return (
        <div className="publisher-application-manager-container">
            <Divider>申请管理</Divider>
            <ApplicationTable
                applications={applications}
                loading={loading}
                onApprove={handleApprove}
                onReject={handleReject}
                isPublisher={true}
            />
        </div>
    );
};

PublisherApplicationManager.propTypes = {
    /** 悬赏令的唯一标识符 */
    bountyId: PropTypes.string.isRequired,
};

export default PublisherApplicationManager;
