import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import QRCode from "qrcode.react";
import { Col, Grid, Row } from "react-bootstrap";
import { Progress } from "antd";
import TableExpand from "../../components/TableExpand";
import Config from "../../config";

export class QrBatchNo extends React.Component {
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
        data: "/qrbatchs",
        total: "/qrbatchs/count"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "批次数量",
          dataIndex: "amount",
          key: "amount"
        },
        {
          title: "批次编号",
          dataIndex: "batchNos",
          key: "batchNos",
          width: 300,
          render: (text = [], record) => (
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "300px"
              }}
            >
              {text.join(",")}
            </div>
          )
        },
        {
          title: "进度",
          dataIndex: "generated",
          key: "generated",
          render: (text, record) => (
            <Progress
              percent={Math.round(record.generated / record.amount * 100)}
              size="small"
            />
          )
        },
        {
          title: "模板",
          dataIndex: "specification",
          key: "specification",
          render: (text, record) => (
            <span title={text.description}>{`${text.name}/${text.quantity ||
              0}个`}</span>
          )
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              {record.fileGenerated ? (
                <a
                  href="javascript:;"
                  onClick={() => {
                    window.open(
                      `${Config.apiUrl}/api/qrbatchs/${record.id}/download`
                    );
                  }}
                >
                  下载
                </a>
              ) : (
                ``
              )}
            </span>
          )
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

const QrBatchNouuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  QrBatchNouuid
});

export default connect(mapStateToProps, mapDispatchToProps)(QrBatchNo);
