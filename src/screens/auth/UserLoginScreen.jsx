import {useContext} from 'react';
import { Form, Input, Button, message } from 'antd';
import './UserLoginScreen.css';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../contexts/UserContext.jsx";
import {loginUser} from "../../services/user.js";

const UserLoginScreen = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // 从UserContext拿到 setUser
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (values) => {
        try {
            const response = await loginUser(values);

            const { token, user } = response;

            localStorage.setItem('token', token);

            // 2. 存储用户信息到 Context & localStorage
            // setUser 是在UserContext里定义的saveUser
            setUser(user);

            // 3. 提示登录成功
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
        <div className="login-container fade-in-container">
            <h2>登录</h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: '请输入邮箱地址' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button className="animated-button" type="primary" htmlType="submit" style={{ width: '100%' }}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserLoginScreen;
