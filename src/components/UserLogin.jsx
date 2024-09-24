import React, {useContext} from 'react';
import { Form, Input, Button, message } from 'antd';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../contexts/UserContext.jsx";
import {loginUser} from "../services/user.js";

const UserLogin = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (values) => {
        try {
            const response = await loginUser(values);
            localStorage.setItem('token', response.token);
            setUser(response.user); // 更新用户上下文
            message.success('登录成功');
            form.resetFields();  // 重置表单
            navigate('/');  // 导航到主页
            window.location.reload(); // 刷新页面
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message); // 显示后端返回的具体错误信息
            } else {
                message.error('登录失败，请重试');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>登录</h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱地址' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>登录</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserLogin;
