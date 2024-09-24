import React, { useState } from 'react';
import { Form, Input, Button, message, Select, Steps, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../services/user';

const { Step } = Steps;
const { Option } = Select;

const CompleteProfile = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const next = () => {
        form.validateFields().then(() => {
            setCurrent(current + 1);
        }).catch(error => {
            console.log("Validation failed:", error);
        });
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const onFinish = async (values) => {
        try {
            await updateUserInfo(values);
            message.success('信息保存成功');
            navigate('/profile'); // 完成后跳转到个人资料页面
        } catch (error) {
            message.error('保存失败，请重试');
        }
    };

    const steps = [

        {
            title: '工作经验',
            content: (
                <>
                    <Form.Item label="公司名称" name="companyName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="职位类型" name="jobTitle">
                        <Input />
                    </Form.Item>
                    <Form.Item label="责任职责" name="responsibilities">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <div className="page-container">
            <Card className="card">
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
                    {steps[current].content}
                    <div className="steps-action">
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                上一步
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
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

export default CompleteProfile;
