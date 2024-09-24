// contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 创建 UserContext
const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 模拟从 API 或本地存储中获取用户信息的异步操作
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 模拟从本地存储或 API 中获取用户信息
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    // 如果没有用户信息，可以执行额外的逻辑，比如重定向到登录页面
                    setUser(null);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    // 保存用户信息到本地存储
    const saveUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 移除用户信息（例如注销时）
    const removeUser = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser: saveUser, removeUser }}>
            {children}
        </UserContext.Provider>
    );
};

// 验证 props
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
