import React from 'react';
import PropTypes from 'prop-types';
import './BountyBasicInfo.css';
import BountyDescription from "./BountyDescription.jsx";

const BountyBasicInfo = ({ title, description, reward, deadline }) => (
    <div className="bounty-basic-info-modern">
        <div className="bounty-title-modern">{title}</div>
        <div className="bounty-description-modern">{description}</div>
        <div className="bounty-details-modern">
            <div className="bounty-reward-modern">
                <i className="bounty-info-icon">💰</i> {reward} 元
            </div>
            <div className="bounty-deadline-modern">
                <i className="bounty-info-icon">🕒</i> {new Date(deadline).toLocaleDateString()}
            </div>
        </div>
    </div>
);

BountyBasicInfo.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    reward: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
};

export default BountyBasicInfo;
