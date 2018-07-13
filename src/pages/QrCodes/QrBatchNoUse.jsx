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

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {}

  render() {

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/qrbatchnos",
        total: "/qrbatchnos/count"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "批次编号",
          dataIndex: "batchNo",
          key: "batchNo"
        },
        {
          title: "已使用二维码",
          dataIndex: "use",
          key: "use"
        },
        {
          title: "未使用二维码",
          dataIndex: "unused",
          key: "unused"
        },
        {
          title: "激活时间",
          dataIndex: "activatedDate",
          key: "activatedDate",
          type: "date"
        },
        {
          title: "状态",
          dataIndex: "activated",
          key: "activated",
          render: (text)=>text?"已激活":"未激活"
        },
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

export default connect(mapStateToProps, mapDispatchToProps)(QrBatchNoUse);
