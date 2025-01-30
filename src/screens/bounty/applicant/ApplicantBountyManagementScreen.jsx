import {Card, Button, message, Table} from "antd";
import {
    getMilestonesByBountyID,
    updateMilestoneByReceiver
} from "../../../services/milestone.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const ApplicantBountyManagementScreen = () => {
    const { id: bountyId } = useParams();
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMilestones = async () => {
            try {
                const milestoneData = await getMilestonesByBountyID(bountyId);
                setMilestones(milestoneData);
            } catch (error) {
                console.error('Error fetching milestones:', error);
                message.error("加载里程碑失败");
            } finally {
                setLoading(false);
            }
        };
        fetchMilestones();
    }, [bountyId]);

    const handleSubmit = async (milestoneId) => {
        try {
            await updateMilestoneByReceiver(bountyId, milestoneId, { is_completed: true });
            message.success("里程碑已提交");
            setMilestones((prev) =>
                prev.map((ms) =>
                    ms.ID === milestoneId ? { ...ms, is_completed: true } : ms
                )
            );
        } catch (error) {
            console.error('Error submitting milestone:', error);
            message.error("提交失败");
        }
    };

    const columns = [
        { title: "标题", dataIndex: "title", key: "Title" },
        { title: "描述", dataIndex: "description", key: "Description" },
        {
            title: "状态",
            dataIndex: "is_completed",
            key: "is_completed",
            render: (isCompleted) => (isCompleted ? "已提交" : "未提交")
        },
        {
            title: "操作",
            key: "actions",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => handleSubmit(record.ID)}
                    disabled={record.is_completed}
                >
                    提交
                </Button>
            ),
        },
    ];

    return (
        <Card title="我的里程碑" bordered={false}>
            <Table
                dataSource={milestones}
                columns={columns}
                rowKey="ID"
                loading={loading}
            />
        </Card>
    );
};

export default ApplicantBountyManagementScreen;
