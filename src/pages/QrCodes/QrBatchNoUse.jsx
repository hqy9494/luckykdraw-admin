import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import QRCode from "qrcode.react";
import { Col, Grid, Row } from "react-bootstrap";
import { Progress, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import Config from "../../config";

export class QrBatchNoUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/qrbatchnos",
        total: "/qrbatchnos/count",
        order: "batchNo DESC"
      },
      buttons: [],
      search: [
        {
          type: "field",
          field: "batchNo",
          title: "批次号"
        },
        {
          type: "option",
          title: "激活状态",
          field: "activated",
          options: [
            {title: "已激活", value: true},
            {title: "未激活", value: false},
          ]
        }
      ],
      columns: [
        {
          title: "批次编号",
          dataIndex: "batchNo",
          key: "batchNo"
        },
        {
          title: "已扫描二维码",
          dataIndex: "scanNumber",
          key: "scanNumber",
          render: text => text || 0
        },
        {
          title: "未扫描二维码",
          dataIndex: "unScanNumber",
          key: "unScanNumber",
          render: text => text || 0
        },
        {
          title: "激活时间",
          dataIndex: "activatedDate",
          key: "activatedDate",
          render: text => (text ? moment(text).format("YYYY-MM-DD HH:mm") : "")
        },
        {
          title: "状态",
          dataIndex: "activated",
          key: "activated",
          render: text => (text ? "已激活" : "未激活")
        }
      ],
      path: `${this.props.match.path}`,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand {...config} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const QrBatchNoUseuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  QrBatchNoUseuuid
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QrBatchNoUse);
