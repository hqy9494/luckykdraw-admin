import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeSuper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getAward();
    this.getBox();
  }

  componentWillReceiveProps(nextProps) {}

  getAward = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awards`
      },
      this.uuid,
      "award"
    );
  };

  getBox = () => {
    this.props.rts(
      {
        method: "get",
        url: `/boxes`
      },
      this.uuid,
      "box"
    );
  };

  confirm1 = id => {
    this.props.rts(
      {
        method: "post",
        url: `/jackpotawardactivities/${id}/activate`
      },
      this.uuid,
      "confirm1",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  confirm2 = id => {
    this.props.rts(
      {
        method: "post",
        url: `/jackpotawardactivities/${id}/cancel`
      },
      this.uuid,
      "confirm2",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/jackpotawardactivities`,
        data: values
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ visible: false, refreshTable: true });
      }
    );
  };

  render() {
    const { award, box } = this.props;

    let awardList = [],
      boxList = [];

    if (award && award[this.uuid]) {
      awardList = award[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }
    if (box && box[this.uuid]) {
      boxList = box[this.uuid].map(t => {
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
        data: "/jackpotawardactivities",
        total: "/jackpotawardactivities/count"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "award.name",
          key: "award.name"
        },
        {
          title: "所属兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "所属机器(名称/序列号)",
          dataIndex: "box.name",
          key: "box.name",
          render: (text, record) => text || record.serial
        },
        {
          title: "面额",
          dataIndex: "award.value",
          key: "award.value"
        },
        {
          title: "状态",
          dataIndex: "state",
          key: "state",
          render: text => {
            switch (text) {
              case "planned":
                return "新建未激活";
              case "activated":
                return "已激活";
              case "canceled":
                return "已取消";
              case "awarded":
                return "已出奖";
              default:
                break;
            }
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            switch (record.state) {
              case "planned":
                return (
                  <span>
                    <Popconfirm
                      title="确定激活此大奖？"
                      onConfirm={() => {
                        this.confirm1(record.id);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="javascript:;">激活</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="确定取消此大奖？"
                      onConfirm={() => {
                        this.confirm2(record.id);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="javascript:;">取消</a>
                    </Popconfirm>
                  </span>
                );
              case "activated":
                return (
                  <Popconfirm
                    title="确定取消此大奖？"
                    onConfirm={() => {
                      this.confirm2(record.id);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <a href="javascript:;">取消</a>
                  </Popconfirm>
                );
              default:
                break;
            }
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
              refresh={this.state.refreshTable}
              onRefreshEnd={() => {
                this.setState({ refreshTable: false });
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="新建"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                label: "奖品",
                field: "awardId",
                type: "select",
                options: awardList,
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "机器",
                field: "boxId",
                type: "select",
                options: boxList,
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

const PrizeSuperuuid = state => state.get("rts").get("uuid");
const award = state => state.get("rts").get("award");
const box = state => state.get("rts").get("box");

const mapStateToProps = createStructuredSelector({
  PrizeSuperuuid,
  award,
  box
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeSuper);
