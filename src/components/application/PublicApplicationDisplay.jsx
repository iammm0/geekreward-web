// src/components/PublicApplicationDisplay.jsx
import React, { useState, useEffect } from "react";
import { Divider, message } from "antd";
import ApplicationTable from "./ApplicationTable.jsx";
import PropTypes from "prop-types";
import {getPublicApplications} from "../../services/application.js";

const PublicApplicationDisplay = ({ bountyId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // 获取公开申请数据
    const fetchPublicApplications = async () => {
        setLoading(true);
        try {
            const data = await getPublicApplications(bountyId);
            // 过滤掉无效的数据
            const validApplications = data.filter(app => app.ID && app.User && app.User.username);
            setApplications(validApplications);
        } catch (error) {
            console.error("加载公开申请数据失败:", error);
            message.error("加载公开申请数据失败，请稍后重试");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bountyId) {
            fetchPublicApplications();
        }
    }, [bountyId]);

    return (
        <div className="public-application-display-container">
            <Divider>申请信息</Divider>
            <ApplicationTable
                applications={applications}
                loading={loading}
                isPublisher={false} // 不显示操作按钮
            />
        </div>
    );
};

PublicApplicationDisplay.propTypes = {
    /** 悬赏令的唯一标识符 */
    bountyId: PropTypes.string.isRequired,
};


export default PublicApplicationDisplay;
