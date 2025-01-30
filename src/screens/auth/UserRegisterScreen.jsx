import { useState } from 'react';
import {Form, Input, Button, Select, Steps, message, Upload, DatePicker} from 'antd';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import {registerUser} from "../../services/user.js";
import './UserRegisterScreen.css';

const { Step } = Steps;
const { Option } = Select;

const skillOptions = [
    'JavaScript', 'Python', 'Go', 'React', 'Node.js', 'Django',
    'Kubernetes', 'Docker', 'SQL', 'NoSQL', 'Machine Learning', 'Data Analysis'
];

const UserRegisterScreen = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // 用于收集多步表单的中间数据
    const [formData, setFormData] = useState({});

    // 用于存储选中的头像文件
    const [avatarFile, setAvatarFile] = useState(null);

    // 当用户选择文件时，先存到 state，等“完成”时一起上传
    const handleAvatarChange = (info) => {
        // 只存第一个文件
        if (info.file.status === 'done' || info.file.status === 'uploading') {
            setAvatarFile(info.file.originFileObj);
        }
    };

    // ============ 点击下一步 ============
    const next = async () => {
        try {
            // 校验当前步骤的字段
            await form.validateFields();
            // 与已有formData合并
            const currentValues = form.getFieldsValue();
            setFormData({ ...formData, ...currentValues });

            setCurrent(current + 1);
        } catch (error) {
            console.log('验证失败:', error);
        }
    };

    // ============ 点击上一步 ============
    const prev = () => {
        setCurrent(current - 1);
    };


    // ============ 完成/提交表单 ============
    const handleSubmit = async () => {
        try {
            // 先校验最后一步字段
            await form.validateFields();
            const lastStepValues = form.getFieldsValue();

            // 合并到最终 formData
            const finalFormData = { ...formData, ...lastStepValues };

            // 使用 FormData 打包所有字段 + 文件
            const multipartForm = new FormData();

            // 逐字段添加 (确保和后端 `form:"xxx"` 对应)
            multipartForm.append('username', finalFormData.username);
            multipartForm.append('email', finalFormData.email);
            multipartForm.append('password', finalFormData.password);
            multipartForm.append('first_name', finalFormData.first_name);
            multipartForm.append('last_name', finalFormData.last_name);
            multipartForm.append('gender', finalFormData.gender);
            multipartForm.append('field_of_expertise', finalFormData.field_of_expertise);
            multipartForm.append('education_level', finalFormData.education_level);

            // 如果有 date_of_birth
            if (finalFormData.date_of_birth) {
                const dateStr = finalFormData.date_of_birth;
                const dateObj = new Date(dateStr);
                multipartForm.append("date_of_birth", dateObj.toISOString());
            }

            // 如果有 skills (数组)
            if (finalFormData.skills && Array.isArray(finalFormData.skills)) {
                // 根据你需要的格式，这里演示 PostgreSQL风格: "{Go,Python}"
                const curlyWrapped = `${finalFormData.skills.join(',')}`;
                multipartForm.append('skills', curlyWrapped);
            }

            // 文件字段（头像）
            if (avatarFile) {
                multipartForm.append('profilePicture', avatarFile);
            }

            // 调用注册API
            await registerUser(multipartForm);

            message.success('注册成功');
            form.resetFields();
            navigate('/');
        } catch (error) {
            console.error('Register error:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);
            } else {
                message.error('注册失败，请重试');
            }
        }
    };

    const steps = [
        {
            title: "注册信息",
            content: (
                <>
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱地址' },
                            { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '密码至少6个字符' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </>
            ),
        },
        {
            title: "基本信息",
            content: (
                <>
                    <Form.Item
                        label="姓"
                        name="last_name"
                        rules={[{ required: true, message: '请输入姓氏' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="名"
                        name="first_name"
                        rules={[{ required: true, message: '请输入名字' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="出生日期"
                        name="date_of_birth"
                        rules={[{ required: true, message: '请选择出生日期' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[{ required: true, message: '请选择性别' }]}
                    >
                        <Select>
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="头像">
                        <Upload
                            beforeUpload={() => false} // 阻止默认上传, 仅选择文件
                            onChange={handleAvatarChange}
                            maxCount={1}
                        >
                            <Button>选择头像</Button>
                        </Upload>
                    </Form.Item>
                </>
            ),
        },
        {
            title: '专业信息',
            content: (
                <>
                    <Form.Item
                        label="专业领域"
                        name="field_of_expertise"
                        rules={[{ required: true, message: '请输入专业领域' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="受教育水平"
                        name="education_level"
                        rules={[{ required: true, message: '请输入受教育水平' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="技能" name="skills">
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="请选择技能"
                        >
                            {skillOptions.map((skill) => (
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
        <div className="register-page-container fade-in-container">
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
                style={{marginTop: 24}}
            >
                <SwitchTransition>
                    <CSSTransition
                        key={current}
                        timeout={300}
                        classNames="step-fade"
                    >
                        <div>
                            {steps[current].content}
                        </div>
                    </CSSTransition>
                </SwitchTransition>

                <div className="steps-action">
                    {current > 0 && (
                        <Button className="animated-button" style={{margin: '0 8px'}} onClick={prev}>
                            上一步
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button className="animated-button" type="primary" onClick={next}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button className="animated-button" type="primary" htmlType="submit">
                            完成
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};


export default UserRegisterScreen;
