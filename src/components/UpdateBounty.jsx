import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, InputNumber, Select, DatePicker, Checkbox } from 'antd';
import { getBountyDetail, updateBounty } from '../services/bounty';
import '../styles/UpdateBounty.css';

const { TextArea } = Input;
const { Option } = Select;

const UpdateBounty = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBountyDetail = async () => {
            try {
                const data = await getBountyDetail(id);
                form.setFieldsValue(data);
            } catch (error) {
                message.error('获取悬赏令详情失败');
            }
        };

        fetchBountyDetail();
    }, [id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await updateBounty(id, values);
            message.success('悬赏令更新成功');
            navigate('/user-bounties');
        } catch (error) {
            message.error('更新悬赏令失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-bounty-container">
            <h2 className="page-title">更新悬赏令</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="赏金" name="reward" rules={[{ required: true, message: '请输入赏金' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="截止日期" name="deadline" rules={[{ required: true, message: '请选择截止日期' }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="难度等级" name="difficultyLevel">
                    <Select>
                        <Option value="easy">简单</Option>
                        <Option value="medium">中等</Option>
                        <Option value="hard">困难</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="悬赏类别" name="category">
                    <Input />
                </Form.Item>
                <Form.Item label="悬赏标签" name="tags">
                    <Select mode="multiple" placeholder="请选择标签">
                        {['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Machine Learning', 'Data Science', 'Web Development', 'Mobile Development', 'Cybersecurity', 'AI', 'Blockchain'].map(tag => (
                            <Option key={tag} value={tag}>{tag}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="所在地" name="location">
                    <Input />
                </Form.Item>
                <Form.Item label="附件链接" name="attachmentUrls">
                    <Input placeholder="用逗号分隔多个链接" />
                </Form.Item>
                <Form.Item label="是否匿名发布" name="anonymous" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="优先级" name="priority">
                    <Select>
                        <Option value="low">低</Option>
                        <Option value="medium">中</Option>
                        <Option value="high">高</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="预算" name="budget">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="付款状态" name="paymentStatus">
                    <Input />
                </Form.Item>
                <Form.Item label="偏好的解决方案类型" name="preferredSolutionType">
                    <Input />
                </Form.Item>
                <Form.Item label="所需技能" name="requiredSkills">
                    <Input placeholder="用逗号分隔多个技能" />
                </Form.Item>
                <Form.Item label="所需经验年限" name="requiredExperience">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="所需认证" name="requiredCertifications">
                    <Input placeholder="用逗号分隔多个认证" />
                </Form.Item>
                <Form.Item label="可见性" name="visibility">
                    <Select>
                        <Option value="public">公开</Option>
                        <Option value="private">私有</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="保密等级" name="confidentiality">
                    <Select>
                        <Option value="confidential">保密</Option>
                        <Option value="non-confidential">非保密</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="合同类型" name="contractType">
                    <Select>
                        <Option value="fixed">固定</Option>
                        <Option value="hourly">按小时</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="预计小时数" name="estimatedHours">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="实际小时数" name="actualHours">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="所需工具" name="toolsRequired">
                    <Input placeholder="用逗号分隔多个工具" />
                </Form.Item>
                <Form.Item label="沟通偏好" name="communicationPreference">
                    <Input />
                </Form.Item>
                <Form.Item label="是否需要反馈" name="feedbackRequired" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="完成标准" name="completionCriteria">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="提交指南" name="submissionGuidelines">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="评价标准" name="evaluationCriteria">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="参考材料" name="referenceMaterials">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="外部链接" name="externalLinks">
                    <Input placeholder="用逗号分隔多个链接" />
                </Form.Item>
                <Form.Item label="其他备注" name="additionalNotes">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="是否需要保密协议" name="ndaRequired" valuePropName="checked">
                    <Checkbox />
                </Form.Item>
                <Form.Item label="接受标准" name="acceptanceCriteria">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item label="付款方式" name="paymentMethod">
                    <Input />
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" loading={loading}>确认更新</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateBounty;
