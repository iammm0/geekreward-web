import React, {useContext, useState} from 'react';
import {
    Form,
    Input,
    Button,
    message,
    InputNumber,
    Select,
    DatePicker,
    Checkbox,
    Card,
    Steps,
    Upload,
    Modal
} from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateBounty.css';
import {createBounty} from "../services/bounty.js";
import {ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {UserContext} from "../contexts/UserContext.jsx";

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const CATEGORY_DIFFICULTY_MAP = {
    '开发': ['简单', '中等', '困难', '专家'],
    '设计': ['简单', '中等', '困难'],
    '数据科学': ['简单', '中等', '困难', '专家'],
    '营销': ['简单', '中等', '困难'],
    '项目管理': ['简单', '中等', '困难'],
    '内容创作': ['简单', '中等', '困难'],
    '咨询': ['中等', '困难', '专家'],
    'IT支持': ['简单', '中等', '困难'],
    '产品管理': ['中等', '困难', '专家'],
    '测试与质量保证': ['简单', '中等', '困难'],
    '运维与安全': ['中等', '困难', '专家'],
    '人力资源': ['简单', '中等', '困难'],
    '金融分析': ['中等', '困难', '专家'],
    '法律服务': ['中等', '困难', '专家'],
    '客户服务': ['简单', '中等', '困难'],
    '销售': ['简单', '中等', '困难'],
    '研究': ['中等', '困难', '专家'],
    '数据输入': ['简单', '中等'],
    '翻译与本地化': ['简单', '中等', '困难'],
    '多媒体制作': ['简单', '中等', '困难'],
    '教育与培训': ['简单', '中等', '困难'],
    '公关与传播': ['中等', '困难'],
    '供应链管理': ['中等', '困难'],
    '人工智能': ['中等', '困难', '专家'],
    '区块链开发': ['中等', '困难', '专家'],
    'AR/VR开发': ['中等', '困难', '专家'],
    '物联网(IoT)': ['中等', '困难', '专家'],
    '机器人技术': ['中等', '困难', '专家'],
    '生物技术': ['中等', '困难', '专家'],
    '环境科学': ['中等', '困难', '专家'],
    '社会科学': ['中等', '困难'],
    '医疗保健': ['中等', '困难', '专家'],
};


const PRIORITY_REWARD_MAP = {
    'D-': [50, 100, 150],
    'D': [100, 200, 300, 500],
    'D+': [500, 800, 1000],
    'C-': [1000, 1200, 1400],
    'C': [1500, 2000, 2500],
    'C+': [3000, 3500, 4000],
    'B-': [5000, 6000, 7000],
    'B': [8000, 10000, 12000],
    'B+': [15000, 18000, 20000],
    'A-': [25000, 30000, 35000],
    'A': [40000, 50000, 60000],
    'A+': [70000, 80000, 100000],
    'S-': [120000, 150000, 180000],
    'S': [200000, 250000, 300000],
    'S+': [350000, 400000, 500000],
    'SS': [600000, 750000, 1000000]
};

const { confirm } = Modal;

const CreateBounty = () => {
    const { user } = useContext(UserContext);  // 从上下文获取user
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priority, setPriority] = useState('中');
    const [rewardRange, setRewardRange] = useState(PRIORITY_REWARD_MAP[priority] || []);

    const next = () => {
        form.validateFields().then(() => {
            setCurrent(current + 1);
        }).catch(error => {
            console.error('Validation failed:', error);
        });
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onFinish = async (values) => {
        try {
            const formattedValues = {
                Title: values.Title,
                Description: values.Description,
                Reward: Number(values.Reward),
                Deadline: values.Deadline.format('YYYY-MM-DD'),
                DifficultyLevel: values.DifficultyLevel,
                Category: values.Category,
                Tags: values.Tags || [],
                Location: values.Location || '',
                AttachmentUrls: values.AttachmentUrls ? values.AttachmentUrls.map(file => file.url || file) : [],
                Anonymous: values.Anonymous || false,
                Priority: values.Priority,
                Budget: Number(values.Budget),
                PaymentStatus: values.PaymentStatus || 'unpaid',
                PreferredSolutionType: values.PreferredSolutionType,
                RequiredSkills: values.RequiredSkills || [],
                RequiredExperience: Number(values.RequiredExperience),
                RequiredCertifications: values.RequiredCertifications || [],
                Visibility: values.Visibility || 'public',
                Confidentiality: values.Confidentiality || 'non-confidential',
                ContractType: values.ContractType,
                EstimatedHours: Number(values.EstimatedHours) || 0,
                ToolsRequired: values.ToolsRequired || [],
                CommunicationPreference: values.CommunicationPreference || '',
                FeedbackRequired: values.FeedbackRequired || false,
                CompletionCriteria: values.CompletionCriteria || '',
                SubmissionGuidelines: values.SubmissionGuidelines || '',
                EvaluationCriteria: values.EvaluationCriteria || '',
                ReferenceMaterials: values.ReferenceMaterials || '',
                ExternalLinks: values.ExternalLinks || [],
                AdditionalNotes: values.AdditionalNotes || '',
                NdaRequired: values.NdaRequired || false,
                AcceptanceCriteria: values.AcceptanceCriteria || '',
                PaymentMethod: values.PaymentMethod,
            };
            console.log('Formatted Values:', formattedValues);
            await createBounty(formattedValues);
            message.success('悬赏令创建成功');
            navigate('/');
        } catch (error) {
            message.error('创建悬赏令失败，请重试');
        }
    };


    if (!user) {
        message.warning('请先登录以发布悬赏令');
        navigate('/login');
        return null;
    }

    const showConfirm = () => {
        confirm({
            title: '你确定要发布这个悬赏令吗?',
            icon: <ExclamationCircleOutlined />,
            content: '确认后将正式发布这个悬赏令。',
            onOk() {
                form.submit(); // 触发表单提交
            },
            onCancel() {
                console.log('取消发布');
            },
            style: { top: 320 } // 调整确认框距离顶部的距离
        });
    };


    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        form.setFieldsValue({ DifficultyLevel: undefined });
    };

    const handlePriorityChange = (value) => {
        setPriority(value);
        setRewardRange(PRIORITY_REWARD_MAP[value]);
        form.setFieldsValue({ Reward: undefined });
    };

    const handleFileChange = ({ fileList }) => {
        form.setFieldsValue({ AttachmentUrls: fileList || [] }); // 确保传递数组
    };

    const steps = [
        {
            title: '基本信息',
            content: (
                <>
                    <Form.Item label="标题" name="Title" rules={[{ required: true, message: '请输入标题' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="Description" rules={[{ required: true, message: '请输入描述' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="截止日期" name="Deadline" rules={[{ required: true, message: '请选择截止日期' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="悬赏类别" name="Category" rules={[{ required: true, message: '请选择悬赏类别' }]}>
                        <Select onChange={handleCategoryChange}>
                            {Object.keys(CATEGORY_DIFFICULTY_MAP).map((category) => (
                                <Option key={category} value={category}>{category}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="难度等级" name="DifficultyLevel" rules={[{ required: true, message: '请选择难度等级' }]}>
                        <Select disabled={!selectedCategory}>
                            {selectedCategory && CATEGORY_DIFFICULTY_MAP[selectedCategory].map((level) => (
                                <Option key={level} value={level}>{level}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="悬赏令等级" name="Priority" rules={[{ required: true, message: '请选择悬赏令等级' }]}>
                        <Select onChange={handlePriorityChange}>
                            {Object.keys(PRIORITY_REWARD_MAP).map((priority) => (
                                <Option key={priority} value={priority}>{priority}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="赏金" name="Reward" rules={[{ required: true, message: '请选择赏金' }]}>
                        <Select>
                            {rewardRange.map((amount) => (
                                <Option key={amount} value={amount}>{amount} 元</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '附加信息',
            content: (
                <>
                    <Form.Item label="附件链接" name="AttachmentUrls" valuePropName="fileList">
                        <Upload
                            multiple={true}
                            maxCount={5}
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.xlsx,.png,.jpg,.zip,.rar,.7z,.txt,.csv,.mp4,.mp3,.avi,.mkv,.mov,.pptx"
                        >
                            <Button icon={<UploadOutlined />}>上传文件（不超过500MB）</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="是否匿名发布" name="Anonymous" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="偏好的解决方案类型" name="PreferredSolutionType" rules={[{ required: true, message: '请选择解决方案类型' }]}>
                        <Select>
                            <Option value="独立">独立方案</Option>
                            <Option value="协作">协作方案</Option>
                            <Option value="开源">开源方案</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '其他信息',
            content: (
                <>
                    <Form.Item label="所需技能" name="RequiredSkills" rules={[{ required: true, message: '请选择所需技能' }]}>
                        <Select mode="multiple" placeholder="选择技能">
                            {['JavaScript', 'Python', 'Java', 'React', 'Node.js'].map(skill => (
                                <Option key={skill} value={skill}>{skill}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="所需经验年限" name="RequiredExperience" rules={[{ required: true, message: '请选择所需经验年限' }]}>
                        <Select>
                            <Option value="1">1年以下</Option>
                            <Option value="1-3">1-3年</Option>
                            <Option value="3-5">3-5年</Option>
                            <Option value="5+">5年以上</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="所需认证" name="RequiredCertifications" rules={[{ required: true, message: '请选择所需认证' }]}>
                        <Select mode="multiple" placeholder="选择认证">
                            {['PMP', 'AWS', 'Azure', 'GCP', 'CISSP'].map(cert => (
                                <Option key={cert} value={cert}>{cert}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="可见性" name="Visibility">
                        <Select>
                            <Option value="public">公开</Option>
                            <Option value="private">私有</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="保密等级" name="Confidentiality">
                        <Select>
                            <Option value="confidential">保密</Option>
                            <Option value="non-confidential">非保密</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="合同类型" name="ContractType">
                        <Select>
                            <Option value="fixed">固定</Option>
                            <Option value="hourly">按小时</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '统计数据',
            content: (
                <>
                    <Form.Item label="完成标准" name="CompletionCriteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="提交指南" name="CubmissionGuidelines">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="评价标准" name="EvaluationCriteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="参考材料" name="ReferenceMaterials">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="外部链接" name="ExternalLinks">
                        <Input placeholder="用逗号分隔多个链接" />
                    </Form.Item>
                    <Form.Item label="其他备注" name="AdditionalNotes">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="是否需要保密协议" name="NdaRequired" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="接受标准" name="AcceptanceCriteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="付款方式" name="PaymentMethod" rules={[{ required: true, message: '请选择付款方式' }]}>
                        <Select>
                            <Option value="微信支付">微信支付</Option>
                            <Option value="支付宝支付">支付宝支付</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <div className="create-bounty-container">
            <h2 className="page-title">起草悬赏令</h2>
            <Card className="create-bounty-card">
                <Steps current={current} style={{ marginBottom: 24 }}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    {steps[current].content}
                    <div className="steps-action">
                        {current > 0 && (
                            <Button style={{ marginRight: 8 }} onClick={prev}>
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={showConfirm}>
                                确认发布
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

CreateBounty.propTypes = {
    user: PropTypes.object.isRequired,  // 根据你的需求，user 应该是一个对象类型且为必填项
};

export default CreateBounty;
