import { useState, useEffect } from 'react';
import {Avatar, Badge, Card, List} from 'antd';
import { getTopGeeks } from "../../services/geek.js";

import './GeekListScreen.css';
import GeekCard from "../../components/geek/GeekCard.jsx";

/**
 * @typedef {import('../models/UserDTO.js').User} User
 */

const GeekListScreen = () => {
    const [geeks, setGeeks] = useState(/** @type {User[]} */ ([]));

    useEffect(() => {
        const fetchGeeks = async () => {
            try {
                const data = await getTopGeeks();
                setGeeks(data);
            } catch (error) {
                console.error('Error fetching geeks:', error);
            }
        };
        fetchGeeks();
    }, []);

    return (
        <div className="geek-list-container">
            <div className="geek-grid">
                {geeks.map((geek, index) => (
                    <GeekCard key={geek.ID} geek={geek} rank={index + 1}/>
                ))}
            </div>
        </div>
    );
};

export default GeekListScreen;
