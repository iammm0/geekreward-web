import React from 'react';
import PropTypes from 'prop-types';
import { EnvironmentOutlined, LinkOutlined } from '@ant-design/icons';
import './AdditionalInfo.css';

const AdditionalInfo = ({ difficulty, category, tags, location, attachmentUrls }) => (
    <div className="additional-info-modern">
        <div className={`difficulty ${difficulty?.toLowerCase()}`}>
            难度等级: {difficulty || "未设置"}
        </div>
        <div className="category-tags-modern">
            <span className="category-tag-modern">{category || "未分类"}</span>
        </div>
        <div className="tags-container-modern">
            {tags?.length > 0 ? tags.map(tag => <span key={tag} className="tag-item-modern">{tag}</span>) : "无标签"}
        </div>
        <div className="other-info-modern">
            <EnvironmentOutlined className="info-icon-modern" />
            所在地: {location || "未提供"}
        </div>
        <div className="other-info-modern">
            <LinkOutlined className="info-icon-modern" />
            附件链接: {attachmentUrls?.length > 0 ? attachmentUrls.join(", ") : "无"}
        </div>
    </div>
);

AdditionalInfo.propTypes = {
    difficulty: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    location: PropTypes.string,
    attachmentUrls: PropTypes.arrayOf(PropTypes.string),
};

export default AdditionalInfo;
