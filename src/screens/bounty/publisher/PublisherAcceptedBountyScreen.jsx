import {Card, Button, message, Table} from "antd";
import {getMilestonesByBountyID} from "../../../services/milestone.js";
import {confirmMilestones, getBounty, verifyMilestones} from "../../../services/bounty.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const PublisherAcceptedBountyScreen = () => {
    const {id: bountyId} = useParams();
    const [bounty, setBounty] = useState(null);
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bountyData = await getBounty(bountyId);
                const milestoneData = await getMilestonesByBountyID(bountyId);
                setBounty(bountyData);
                setMilestones(milestoneData);
            } catch {
                message.error("加载悬赏令数据失败");
            }
        };
        fetchData();
    }, [bountyId]);

    const handleConfirm = async () => {
        try {
            await confirmMilestones(bountyId);
            message.success("所有里程碑已确认");
        } catch {
            message.error("确认失败");
        }
    };

    const handleVerify = async () => {
        try {
            await verifyMilestones(bountyId);
            message.success("所有里程碑已审核");
        } catch {
            message.error("审核失败");
        }
    };

    const milestoneColumns = [
        {title: "标题", dataIndex: "title", key: "title"},
        {title: "描述", dataIndex: "description", key: "description"},
        {
            title: "状态",
            dataIndex: "submitted",
            key: "submitted",
            render: (submitted) => (submitted ? "已提交" : "未提交")
        },
    ];


    return (
        <div>
            <Card title="悬赏令信息" bordered={false}>
                <p>标题: {bounty?.Title}</p>
                <p>描述: {bounty?.Description}</p>
            </Card>
            <Card title="里程碑详情" bordered={false} style={{marginTop: 16}}>
                <Table dataSource={milestones} columns={milestoneColumns} rowKey="id"/>
                <div style={{marginTop: 16}}>
                    <Button type="primary" onClick={handleConfirm} style={{marginRight: 8}}>
                        接收者确认提交
                    </Button>
                    <Button onClick={handleVerify}>发布者审核</Button>
                </div>
            </Card>
        </div>
    );
};

export default PublisherAcceptedBountyScreen;
