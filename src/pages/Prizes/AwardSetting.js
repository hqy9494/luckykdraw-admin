import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class AwardSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getType();
  }

  componentWillReceiveProps(nextProps) {}

  getType = () => {
    this.props.rts(
      {
        method: "get",
        url: "/stockAwards"
      },
      this.uuid,
      "type"
    );
  };

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "post",
          url: "/boxStock/bind",
          data: {
            boxId: this.state.curRow.id,
            stockAwardId: values.stockAwardId
          }
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
        }
      );
    } else {
    }
  };

  submitEnabled = (boxId, ifEnable) => {
    if (boxId) {
      this.props.rts(
        {
          method: "post",
          url: "/boxStock/switch",
          data: {
            boxId,
            ifEnable
          }
        },
        this.uuid,
        "submitEnabled",
        () => {
          this.setState({ refreshTable: true });
        }
      );
    }
  };

  render() {
    const { type } = this.props;

    let typeList = [];

    if (type && type[this.uuid]) {
      typeList = type[this.uuid].map(t => {
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
        data: "/boxStock"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "实物累计金额",
          dataIndex: "boxStock.stock",
          key: "boxStock.stock"
        },
        {
          title: "未派发奖品数量",
          dataIndex: "ljjpsl",
          key: "ljjpsl"
        },
        {
          title: "累计奖品数量",
          dataIndex: "asarc",
          key: "asarc"
        },
        {
          title: "实物奖项",
          dataIndex: "stockAward.name",
          key: "stockAward.name"
        },
        {
          title: "奖项额度",
          dataIndex: "stockAward.stockCount",
          key: "stockAward.stockCount"
        },
        {
          title: "状态",
          dataIndex: "boxStock.enabled",
          key: "boxStock.enabled",
          render: text => (text ? "开启" : "关闭")
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let boxStock = record.boxStock ? record.boxStock : {};
            return (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.setState({ curRow: record, visible: true });
                  }}
                >
                  重置奖项
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title={`是否${boxStock.enabled ? "关闭" : "开启"}${
                    record.name
                  }奖项设置`}
                  onConfirm={() => {
                    this.submitEnabled(record.id, !boxStock.enabled);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <a href="javascript:;">
                    {boxStock.enabled ? "关闭" : "开启"}
                  </a>
                </Popconfirm>
              </span>
            );
          }
        }
      ]
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand
              {...config}
              path={`${this.props.match.path}`}
              replace={this.props.replace}
              refresh={this.state.refreshTable}
              onRefreshEnd={() => {
                this.setState({ refreshTable: false });
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title={(this.state.curRow && this.state.curRow.name) || "添加奖品"}
          onCancel={() => {
            this.setState({ visible: false });
            window.location.reload();
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                label: "实物奖项",
                field: "stockAwardId",
                type: "select",
                options: typeList,
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              }
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

const AwardSettinguuid = state => state.get("rts").get("uuid");
const type = state => state.get("rts").get("type");

const mapStateToProps = createStructuredSelector({
  AwardSettinguuid,
  type
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AwardSetting);
