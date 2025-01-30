import {useState, useEffect, createContext} from 'react';
import PropTypes from 'prop-types';

// 创建一个 Context，默认值 null
const UserContext = createContext(null);

// 提供一个 Provider 组件
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 在组件挂载时，从 localStorage 加载 user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');

                // 检查 storedUser 是否为有效的 JSON
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    setUser(null); // 没有用户信息时设置为 null
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    /**
     * 保存用户信息到 state & localStorage
     * @param {Object} userData - 后端返回的用户对象
     */
    const saveUser = (userData) => {
        try {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('保存用户信息失败:', error);
        }
    };

    // 移除用户信息（例如注销时）
    const removeUser = () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // 如果有存token，也一并清除
        } catch (error) {
            console.error('移除用户信息失败:', error);
        }
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
