import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Divider, Modal, Popconfirm} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import QRCode from "qrcode.react";

export class PrizeSuper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showQrCode: false,
      record: {},
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getAward();
    this.getBox();
  }

  componentWillReceiveProps(nextProps) {
  }

  getAward = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awards`,
        params: {
          filter: {where: {type: 'jack_pot_award'}}
        }
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
        this.setState({refreshTable: true});
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
        this.setState({refreshTable: true});
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
        this.setState({visible: false, refreshTable: true});
      }
    );
  };

  render() {
    const {award, box} = this.props;

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
          title: "添加",
          onClick: () => {
            this.setState({visible: true, curRow: null});
          }
        }
      ],
      search: [
        {
          type: "relevance",
          field: "tenantId",
          model: {
            name: "tenant",
            api: "/tenants",
            field: "name"
          },
          title: "兑奖中心"
        },
        {
          type: "relevance",
          field: "boxId",
          model: {
            name: "box",
            api: "/boxes",
            field: "name"
          },
          title: "设备名称"
        },
        {
          type: "relevance",
          field: "awardId",
          model: {
            name: "award",
            api: "/awards",
            field: "name"
          },
          title: "奖品名称"
        },
        {
          type: "option",
          title: "状态",
          field: "state",
          options: [
            {title: "未激活", value: "planned"},
            {title: "已激活", value: "activated"},
            {title: "已取消", value: "canceled"},
            {title: "已出奖", value: "awarded"}
          ]
        }
      ],
      columns: [
        {
          title: "名称",
          dataIndex: "award.name",
          key: "award.name"
        },
        {
          title: "兑奖中心",
          dataIndex: "tenant.name",
          key: "tenant.name"
        },
        {
          title: "设备名称/序列号",
          dataIndex: "box.name",
          key: "box.name",
          render: (text, record) => text || record.serial
        },
        {
          title: "产品价格",
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
                return "未激活";
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
                    <Divider type="vertical"/>
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
                     <Divider type="vertical"/>
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({record, showQrCode: true});
                }}
              >
                显示
              </a>
                  </span>
                );
              case "activated":
                return (
                  <span>
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
                     <Divider type="vertical"/>
                                  <a
                                    href="javascript:;"
                                    onClick={() => {
                                      this.setState({record, showQrCode: true});
                                    }}
                                  >
                显示
              </a>
                  </span>
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
              path={`${this.props.match.path}`}
              replace={this.props.replace}
              refresh={this.state.refreshTable}
              onRefreshEnd={() => {
                this.setState({refreshTable: false});
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title="添加大奖"
          onCancel={() => {
            this.setState({visible: false});
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
                  rules: [{required: true, message: "必填项"}]
                }
              },
              {
                label: "设备",
                field: "boxId",
                type: "select",
                options: boxList,
                params: {
                  rules: [{required: true, message: "必填项"}]
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({visible: false});
            }}
          />
        </Modal>

        <Modal
          visible={this.state.showQrCode}
          title={this.state.record.award && this.state.record.award.name}
          onCancel={() => {
            this.setState({showQrCode: false});
          }}
          footer={null}
        >
          <div style={{'text-align': 'center'}}>
            <QRCode value={this.state.record.qrCode && this.state.record.qrCode.url} size={120}/>
          </div>
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
