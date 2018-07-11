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
    this.getSpecifications();
  }

  componentWillReceiveProps(nextProps) {}

  getSpecifications = () => {
    this.props.rts(
      {
        method: "get",
        url: `/specifications`
      },
      this.uuid,
      "specifications"
    );
  };

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/qrbatchs/generate`,
        data: values
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  render() {
    const { specifications } = this.props;

    let specificationsList = [];

    if (specifications && specifications[this.uuid]) {
      specificationsList = specifications[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/qrbatchs",
        total: "/qrbatchs/count"
      },
      buttons: [
        {
          title: "生产",
          onClick: () => {
            this.setState({ visible: true });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "批次数量",
          dataIndex: "amount",
          key: "amount"
        },
        {
          title: "批次编号",
          dataIndex: "batchNos",
          key: "batchNos",
          // width: 300,
          // render: (text = [], record) => (
          //   <div
          //     style={{
          //       overflow: "hidden",
          //       textOverflow: "ellipsis",
          //       whiteSpace: "nowrap",
          //       width: "300px"
          //     }}
          //   >
          //     {text.join(",")}
          //   </div>
          // )
          render: (text = [], record) =>
            text.length > 1 ? `${text[0]} ~ ${text[text.length - 1]}` : text[0]
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
        <Modal
          visible={this.state.visible}
          title="生成二维码"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "number",
                field: "amount",
                label: "数量",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "select",
                field: "specificationId",
                label: "规格",
                options: specificationsList||[],
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
            }}
          />
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const QrBatchNoUseuuid = state => state.get("rts").get("uuid");
const specifications = state => state.get("rts").get("specifications");

const mapStateToProps = createStructuredSelector({
  QrBatchNoUseuuid,
  specifications
});

export default connect(mapStateToProps, mapDispatchToProps)(QrBatchNoUse);
