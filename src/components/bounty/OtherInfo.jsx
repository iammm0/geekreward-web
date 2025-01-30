import {DollarCircleOutlined, GlobalOutlined, SafetyCertificateOutlined, UserOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import PropTypes from "prop-types";

const OtherInfo = ({ bounty }) => (
    <div className="other-info-container">
        <div className="other-info-item">
            <DollarCircleOutlined className="other-info-icon"/>
            <div>
                <div className="other-info-label">预算</div>
                <div className="other-info-value">{bounty.Budget || '未提供'}</div>
            </div>
        </div>
        <div className="other-info-item">
            <UserOutlined className="other-info-icon"/>
            <div>
                <div className="other-info-label">匿名</div>
                <div className="other-info-value">{bounty.Anonymous ? '是' : '否'}</div>
            </div>
        </div>
        <div className="other-info-item">
            <SafetyCertificateOutlined className="other-info-icon"/>
            <div>
                <div className="other-info-label">付款状态</div>
                <div className="other-info-value">{bounty.PaymentStatus || '未提供'}</div>
            </div>
        </div>
        <div className="other-info-item">
            <GlobalOutlined className="other-info-icon"/>
            <Tooltip title="合同类型说明">
                <div>
                    <div className="other-info-label">合同类型</div>
                    <div className="other-info-value">{bounty.ContractType || '未提供'}</div>
                </div>
            </Tooltip>
        </div>
    </div>
);

OtherInfo.propTypes = {
    bounty: PropTypes.shape({
        Budget: PropTypes.number,
        Anonymous: PropTypes.bool,
        PaymentStatus: PropTypes.string,
        ContractType: PropTypes.string,
    }).isRequired,
};

export default OtherInfo;