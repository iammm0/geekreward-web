import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Steps, message, Card, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { registerUser } from "../services/user";
import { UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;

const skillOptions = [
    'JavaScript', 'Python', 'Go', 'React', 'Node.js', 'Django',
    'Kubernetes', 'Docker', 'SQL', 'NoSQL', 'Machine Learning', 'Data Analysis'
];

const UserRegister = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({});

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...formData,
                ...values,
                DateOfBirth: formData.DateOfBirth ? formData.DateOfBirth.toISOString() : undefined,
            };

            await registerUser(formattedValues, fileList.length > 0 ? fileList[0].originFileObj : null);
            message.success('注册成功');
            form.resetFields();
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('注册失败，请重试');
            }
        }
    };

    const next = async () => {
        try {
            const values = await form.validateFields();
            setFormData({ ...formData, ...values });
            setCurrent(current + 1);
        } catch (error) {
            console.log("Validation failed:", error);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const steps = [
        {
            title: "注册信息",
            content: (
                <>
                    <Form.Item label="用户名" name="Username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="邮箱" name="Email" rules={[{ required: true, message: '请输入邮箱地址' }, { type: 'email', message: '请输入有效的邮箱地址' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="密码" name="Password" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6个字符' }]}>
                        <Input.Password />
                    </Form.Item>
                </>
            ),
        },
        {
            title: "基本信息",
            content: (
                <>
                    <Form.Item label="头像" name="ProfilePicture">
                        <Upload
                            fileList={fileList}
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>选择头像</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="姓" name="LastName" rules={[{ required: true, message: '请输入姓氏' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="名" name="FirstName" rules={[{ required: true, message: '请输入名字' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="出生日期" name="DateOfBirth" rules={[{ required: true, message: '请选择出生日期' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="性别" name="Gender" rules={[{ required: true, message: '请选择性别' }]}>
                        <Select>
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '专业信息',
            content: (
                <>
                    <Form.Item label="专业领域" name="FieldOfExpertise" rules={[{ required: true, message: '请输入专业领域' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="受教育水平" name="EducationLevel" rules={[{ required: true, message: '请输入受教育水平' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="技能"
                        name="Skills"
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="请选择技能"
                        >
                            {skillOptions.map(skill => (
                                <Select.Option key={skill} value={skill}>
                                    {skill}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <div className="page-container">
            <Card className="card">
                <h2>注册</h2>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title}/>
                    ))}
                </Steps>
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={formData}
                    onFinish={handleSubmit}
                    style={{ marginTop: 24 }}
                >
                    {steps[current].content}
                    <div className="steps-action">
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={prev}>
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" htmlType="submit">
                                完成
                            </Button>
                        )}
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default UserRegister;
