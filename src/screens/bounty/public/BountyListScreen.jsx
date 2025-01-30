import { useState, useEffect } from 'react';
import './BountyListScreen.css';
import { getBountiesByFilter } from "../../../services/bounty.js";
import BountyCard from "../../../components/bounty/BountyCard.jsx";

const BountyListScreen = () => {
    const [bounties, setBounties] = useState([]);

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                const data = await getBountiesByFilter();
                console.log('Fetched bounties:', data);
                setBounties(data);
            } catch (error) {
                console.error('Error fetching bounties:', error);
            }
        };
        fetchBounties();
    }, []);

    return (
        <div className="bounty-list-container fade-in-container">
            <div className="bounty-grid">
                {bounties.map((bounty) => (
                    <BountyCard key={bounty.ID} bounty={bounty} />
                ))}
            </div>
        </div>
    );
};

export default BountyListScreen;
