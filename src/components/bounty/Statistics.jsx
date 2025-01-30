import React from 'react';
import { EyeOutlined, FileTextOutlined, CommentOutlined, StarFilled } from '@ant-design/icons';
import './Statistics.css';
import PropTypes from "prop-types";

const Statistics = ({ viewCount, submissionCount, commentCount, rating }) => (
    <div className="statistics-modern">
        <div className="stats-item-modern">
            <EyeOutlined className="stats-icon-modern"/>
            <div>
                <div className="stats-value-modern">{viewCount}</div>
                <div className="stats-label-modern">查看次数</div>
            </div>
        </div>
        <div className="stats-item-modern">
            <FileTextOutlined className="stats-icon-modern"/>
            <div>
                <div className="stats-value-modern">{submissionCount}</div>
                <div className="stats-label-modern">提交次数</div>
            </div>
        </div>
        <div className="stats-item-modern">
            <CommentOutlined className="stats-icon-modern"/>
            <div>
                <div className="stats-value-modern">{commentCount}</div>
                <div className="stats-label-modern">评论次数</div>
            </div>
        </div>
        <div className="stats-item-modern">
            <StarFilled className="stats-icon-modern"/>
            <div>
                <div className="stats-value-modern">{rating}</div>
                <div className="stats-label-modern">评分</div>
            </div>
        </div>
    </div>
);

// 添加 PropTypes 验证
Statistics.propTypes = {
    viewCount: PropTypes.number.isRequired,
    submissionCount: PropTypes.number.isRequired,
    commentCount: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
};


export default Statistics;
