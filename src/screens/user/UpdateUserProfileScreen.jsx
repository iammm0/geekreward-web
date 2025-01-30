import { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message, Select, Switch, Collapse, Typography } from 'antd';
import { UserContext } from '../../contexts/UserContext.jsx';
import { getUserInfo, updateUserInfo } from '../../services/user.js';
import './UpdateUserProfileScreen.css';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const UpdateUserProfileScreen = () => {
    const { user, setUser } = useContext(UserContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 加载用户数据
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
                form.setFieldsValue(userInfo);
            } catch (error) {
                message.error('获取用户信息失败');
            }
        };

        if (user) {
            form.setFieldsValue(user);
        } else {
            fetchUserData();
        }
    }, [user, form, setUser]);

    // 提交表单
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const updatedUser = await updateUserInfo(values);
            setUser(updatedUser);
            message.success('个人资料更新成功');
        } catch (error) {
            message.error('更新个人资料失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container fade-in-container">
            <h2 className="page-title">更新个人资料</h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Collapse defaultActiveKey={['1']}>
                    {/* 基本信息 */}
                    <Panel header="基本信息" key="1">
                        <Form.Item label="用户名" name="username" rules={[{required: true, message: '请输入用户名'}]}>
                            <Input placeholder="请输入用户名"/>
                        </Form.Item>
                        <Form.Item label="邮箱" name="email"
                                   rules={[{required: true, type: 'email', message: '请输入有效的邮箱地址'}]}>
                            <Input placeholder="请输入邮箱地址"/>
                        </Form.Item>
                        <Form.Item label="姓名" name="firstName">
                            <Input placeholder="请输入您的名字"/>
                        </Form.Item>
                        <Form.Item label="姓氏" name="lastName">
                            <Input placeholder="请输入您的姓氏"/>
                        </Form.Item>
                        <Form.Item label="性别" name="gender">
                            <Select placeholder="请选择性别">
                                <Option value="male">男</Option>
                                <Option value="female">女</Option>
                                <Option value="other">其他</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="出生日期" name="dateOfBirth">
                            <Input type="date"/>
                        </Form.Item>
                    </Panel>

                    {/* 职业信息 */}
                    <Panel header="职业信息" key="2">
                        <Form.Item label="机构/单位" name="institution">
                            <Input placeholder="请输入您的单位名称"/>
                        </Form.Item>
                        <Form.Item label="部门" name="department">
                            <Input placeholder="请输入您的部门"/>
                        </Form.Item>
                        <Form.Item label="专业领域" name="fieldOfExpertise">
                            <Input placeholder="请输入您的专业领域"/>
                        </Form.Item>
                        <Form.Item label="经验年限" name="yearsOfExperience">
                            <Select placeholder="请选择经验年限">
                                {[0, 1, 3, 5, 10].map((years) => (
                                    <Option key={years} value={years}>{`${years} 年`}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Panel>

                    {/* 社交信息 */}
                    <Panel header="社交与兴趣" key="3">
                        <Form.Item label="个人技能" name="skills">
                            <Input placeholder="请输入技能（以逗号分隔）"/>
                        </Form.Item>
                        <Form.Item label="掌握语言" name="languages">
                            <Input placeholder="请输入语言（以逗号分隔）"/>
                        </Form.Item>
                        <Form.Item label="个人目标" name="goals">
                            <TextArea rows={2} placeholder="请输入您的个人目标"/>
                        </Form.Item>
                        <Form.Item label="Github 链接" name="gitHubProfile">
                            <Input placeholder="请输入您的 GitHub 链接"/>
                        </Form.Item>
                    </Panel>

                    {/* 设置 */}
                    <Panel header="设置" key="4">
                        <Form.Item label="是否启用两步验证" name="twoFactorEnabled" valuePropName="checked">
                            <Switch/>
                        </Form.Item>
                        <Form.Item label="用户所在时区" name="timezone">
                            <Select placeholder="请选择时区">
                                {['UTC', 'CST', 'EST', 'PST'].map((tz) => (
                                    <Option key={tz} value={tz}>{tz}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="用户偏好的语言" name="preferredLanguage">
                            <Select placeholder="请选择语言">
                                <Option value="zh-CN">中文</Option>
                                <Option value="en-US">英文</Option>
                                <Option value="ja-JP">日语</Option>
                            </Select>
                        </Form.Item>
                    </Panel>
                </Collapse>

                {/* 提交按钮 */}
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="animated-button"
                        style={{width: '100%', marginTop: '16px'}}
                    >
                        更新资料
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateUserProfileScreen;
