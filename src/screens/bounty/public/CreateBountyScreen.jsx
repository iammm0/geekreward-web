import {useContext, useState} from 'react';
import {
    Form,
    Input,
    Button,
    message,
    Select,
    DatePicker,
    Checkbox,
    Card,
    Steps,
    Upload,
    Modal
} from 'antd';
import { useNavigate } from 'react-router-dom';
import './CreateBountyScreen.css';
import {createBounty} from "../../../services/bounty.js";
import {ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";
import {UserContext} from "../../../contexts/UserContext.jsx";


const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const { confirm } = Modal;

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

const CreateBountyScreen = () => {
    const { user } = useContext(UserContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [current, setCurrent] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priority, setPriority] = useState('');
    const [rewardRange, setRewardRange] = useState([]);
    const [fileList, setFileList] = useState([]); // 本地 state 维护 Upload 文件列表


    // 用于弹出 "确认发布" 对话框
    const showConfirm = () => {
        confirm({
            title: '你确定要发布这个悬赏令吗?',
            icon: <ExclamationCircleOutlined />,
            content: '确认后将正式发布这个悬赏令。',
            onOk() {
                form.submit();
            },
            onCancel() {
                console.log('取消发布');
            },
            style: { top: 420 }
        });
    };

    // 提交表单
    const onFinish = async (values) => {
        // 处理日期
        const deadlineStr = values.deadline
            ? values.deadline.format('YYYY-MM-DD')
            : '';

        // 如果 attachment_urls 里还不是最终可访问的url，就要提取
        const formattedAttachmentUrls = (values.attachment_urls || []).map(file => file.url);

        let formattedExternalLinks = [];

        // 如果用户输入了某些链接
        if (values.external_links) {
            // 按逗号切分
            formattedExternalLinks = values.external_links
                .split(",")                // => ["https://example.com", " https://example2.com"]
                .map(link => link.trim())  // => ["https://example.com", "https://example2.com"]
                .filter(Boolean);          // 去除空字符串
        }

        const payload = {
            ...values,
            deadline: deadlineStr,
            attachment_urls: formattedAttachmentUrls,
            external_links: formattedExternalLinks,
        };

        try {
            console.log('Payload =>', payload);
            await createBounty(payload);
            message.success('悬赏令创建成功');
            navigate('/');
        } catch (error) {
            console.error('Error creating bounty:', error);
            message.error('创建失败，请检查输入或稍后重试');
        }
    };


    if (!user) {
        message.warning('请先登录以发布悬赏令');
        navigate('/login');
        return null;
    }

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        form.setFieldsValue({ difficulty_level: undefined });
    };

    const handlePriorityChange = (value) => {
        setPriority(value);
        setRewardRange(PRIORITY_REWARD_MAP[value] || []);
        form.setFieldsValue({ reward: undefined });
    };

    const handleFileChange = ({ fileList }) => {
        const files = fileList.map((file) => ({
            // 将新的fileList映射为 { uid, name, status, url } 格式
            uid: file.uid,
            name: file.name,
            status: file.status,
            url: file.url || file.response?.file_url || ''
            // 这里假设后端返回 { file_url: "/uploads/xxx" }
            // 如果您后端返回字段不同，如 'url' 直接，就改成 file.response.url
        }));
        form.setFieldsValue({ attachment_urls: files });

        // 同步更新本地 state
        setFileList(files);
        // 同步写入 form 字段
        form.setFieldsValue({ attachment_urls: files });
    };


    const steps = [
        {
            title: '基本信息',
            fields: ['title', 'description', 'deadline', 'category', 'difficulty_level', 'priority', 'reward'],
            content: (
                <>
                    <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="描述" name="description" rules={[{ required: true, message: '请输入描述' }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        label="截止日期"
                        name="deadline"
                        rules={[{ required: true, message: '请选择截止日期' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="悬赏类别" name="category" rules={[{ required: true, message: '请选择悬赏类别' }]}>
                        <Select onChange={handleCategoryChange}>
                            {Object.keys(CATEGORY_DIFFICULTY_MAP).map((cat) => (
                                <Option key={cat} value={cat}>{cat}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="难度等级"
                        name="difficulty_level"
                        rules={[{ required: true, message: '请选择难度等级' }]}
                    >
                        <Select disabled={!selectedCategory}>
                            {selectedCategory &&
                                CATEGORY_DIFFICULTY_MAP[selectedCategory].map((level) => (
                                    <Option key={level} value={level}>{level}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="悬赏令等级"
                        name="priority"
                        rules={[{ required: true, message: '请选择悬赏令等级' }]}
                    >
                        <Select onChange={handlePriorityChange}>
                            {Object.keys(PRIORITY_REWARD_MAP).map((p) => (
                                <Option key={p} value={p}>{p}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="赏金"
                        name="reward"
                        rules={[{ required: true, message: '请选择赏金' }]}
                    >
                        <Select>
                            {rewardRange.map((amount) => (
                                <Option key={amount} value={amount}>{amount} 元</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            )
        },
        {
            title: '附加信息',
            fields: ['attachment_urls', 'anonymous', 'preferred_solution_type'],
            content: (
                <>
                    <Form.Item label="附件链接" name="attachment_urls" valuePropName="fileList">
                        <Upload
                            multiple
                            action="http://localhost:8080/attachment" // 如果您要自动上传到后端
                            // 如果您想在 handleFileChange 里用 axios 自行上传，就 beforeUpload={() => false}
                            maxCount={5}
                            onChange={handleFileChange}
                            showUploadList={{ showRemoveIcon: true }}  // 是否显示文件列表
                        >
                            <Button icon={<UploadOutlined />}>上传文件（不超过500MB）</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="是否匿名发布" name="anonymous" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="偏好的解决方案类型" name="preferred_solution_type" rules={[{ required: true, message: '请选择解决方案类型' }]}>
                        <Select>
                            <Option value="独立">独立方案</Option>
                            <Option value="协作">协作方案</Option>
                            <Option value="开源">开源方案</Option>
                        </Select>
                    </Form.Item>
                </>
            )
        },
        {
            title: '需求信息',
            fields: ['required_skills', 'required_experience', 'required_certifications'],
            content: (
                <>
                    <Form.Item
                        label="所需技能"
                        name="required_skills"
                        rules={[{ required: true, message: '请选择所需技能' }]}
                    >
                        <Select mode="multiple" placeholder="选择技能">
                            {['JavaScript', 'Python', 'React', 'Node.js', '设计'].map((skill) => (
                                <Option key={skill} value={skill}>
                                    {skill}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所需经验年限"
                        name="required_experience"
                        rules={[{ required: true, message: '请选择所需经验年限' }]}
                    >
                        <Select>
                            <Option value={0}>无</Option>
                            <Option value={1}>1年</Option>
                            <Option value={3}>3年</Option>
                            <Option value={5}>5年</Option>
                            <Option value={10}>10年以上</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所需认证"
                        name="required_certifications"
                        rules={[{ required: false }]}
                    >
                        <Select mode="multiple" placeholder="选择认证">
                            {['PMP', 'AWS', 'CISSP', '设计认证'].map((cert) => (
                                <Option key={cert} value={cert}>
                                    {cert}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            )
        },
        {
            title: '统计与评估',
            fields: ['completion_criteria', 'submission_guidelines', 'evaluation_criteria', 'reference_materials', 'external_links', 'additional_notes', 'nda_required', 'acceptance_criteria'],
            content: (
                <>
                    <Form.Item label="完成标准" name="completion_criteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="提交指南" name="submission_guidelines">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="评价标准" name="evaluation_criteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="参考材料" name="reference_materials">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="外部链接" name="external_links">
                        <Input placeholder="用逗号分隔多个链接" />
                    </Form.Item>
                    <Form.Item label="其他备注" name="additional_notes">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="是否需要保密协议" name="nda_required" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                    <Form.Item label="接受标准" name="acceptance_criteria">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="支付方式" name="payment_method" rules={[{ required: true, message: '请选择支付方式' }]}>
                        <Select>
                            <Option value="微信支付">微信支付</Option>
                            <Option value="支付宝">支付宝</Option>
                        </Select>
                    </Form.Item>
                </>
            )
        }
    ];



    const next = () => {
        const fieldsToValidate = steps[current].fields;
        form.validateFields(fieldsToValidate)
            .then(() => setCurrent((prev) => prev + 1))
            .catch((errInfo) => console.log('校验失败 =>', errInfo));
    };

    const prev = () => setCurrent((prev) => prev - 1);

    return (
        <div style={{ marginTop: 24 }}>
            <Card title="悬赏令创建流程">
                <Steps current={current} style={{marginBottom: 24}}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{
                        anonymous: false,
                        payment_method: "微信支付",
                    }}
                >
                    {/* 动态渲染当前步骤内容 */}
                    {steps.map((step, index) => (
                        <div key={step.title} style={{display: index === current ? 'block' : 'none'}}>
                            {step.content}
                        </div>
                    ))}

                    {/* 操作按钮 */}
                    <div style={{textAlign: 'center', marginTop: 24}}>
                        {current > 0 && (
                            <Button
                                style={{marginRight: 8}}
                                onClick={prev}
                                className="animated-button"
                            >
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={next}
                                className="animated-button"
                            >
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={showConfirm}
                                className="animated-button"
                            >
                                确认发布
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

CreateBountyScreen.propTypes = {
    user: PropTypes.object
};

export default CreateBountyScreen;
