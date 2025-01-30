import React from "react";
import PropTypes from "prop-types";
import "./BountyDescription.css";

const BountyDescription = ({ description, maxLength = 80 }) => {
    // 截断逻辑
    const truncateText = (text, maxLength) =>
        text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

    return (
        <div className="bounty-description-container">
            <p className="bounty-description-content">
                {truncateText(description, maxLength)}
            </p>
        </div>
    );
};

BountyDescription.propTypes = {
    description: PropTypes.string.isRequired,
    maxLength: PropTypes.number, // 可选参数：允许用户自定义最大长度
};

export default BountyDescription;
