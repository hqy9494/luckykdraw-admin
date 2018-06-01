import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal, Tabs} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

const TabPane = Tabs.TabPane;

export class Record extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "post",
          url: `/awardrecords/${this.state.curRow.id}/fahuo`,
          data: values
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({refreshTable1: true, visible: false});
        }
      );
    }
  };

  render() {
    const config1 = {
      tab: 1,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awardrecords/search/fahuo",
        total: "/awardrecords/count/fahuo"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "award.name",
          key: "award.name"
        },
        {
          title: "奖品类型",
          dataIndex: "awartTypeTitle",
          key: "awartTypeTitle"
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
          title: "中奖粉丝",
          dataIndex: "user.nickname",
          key: "user.nickname",
          render: (text, record) => text || record.fullname
        },
        {
          title: "时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) =>
            record.fahuoed ? (
              <span>已记录发货信息</span>
            ) : (
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({curRow: record, visible: true});
                }}
              >
                发货
              </a>
            )
        }
      ]
    };

    const config2 = {
      tab: 2,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awardrecords/search/virtual",
        total: "/awardrecords/count/virtual"
      },
      buttons: [],
      search: [],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "award.name",
          key: "award.name"
        },

        {
          title: "奖品类型",
          dataIndex: "awartTypeTitle",
          key: "awartTypeTitle"
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
          title: "中奖粉丝",
          dataIndex: "user.nickname",
          key: "user.nickname",
          render: (text, record) => text || record.fullname
        },
        {
          title: "时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date"
        }
      ]
    };

    return (
      <Grid fluid>
        <Tabs defaultActiveKey="1">
          <TabPane tab="实物" key="1">
            <Row>
              <Col lg={12}>
                <TableExpand
                  {...config1}
                  refresh={this.state.refreshTable1}
                  onRefreshEnd={() => {
                    this.setState({refreshTable1: false});
                  }}
                />
              </Col>
            </Row>
            <Modal
              visible={this.state.visible}
              title="发货信息"
              onCancel={() => {
                this.setState({visible: false});
              }}
              footer={null}
            >
              <FormExpand
                elements={[
                  {
                    label: "物流公司",
                    field: "company",
                    type: "select",
                    options: [
                      {
                        title: "顺丰",
                        value: "sf"
                      },
                      {
                        title: "圆通",
                        value: "yt"
                      },
                      {
                        title: "EMS",
                        value: "ems"
                      },
                      {
                        title: "中通",
                        value: "zt"
                      },
                      {
                        title: "韵达",
                        value: "yd"
                      }
                    ],
                    params: {
                      rules: [{required: true, message: "必填项"}]
                    }
                  },
                  {
                    type: "text",
                    field: "no",
                    label: "快递单号",
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
          </TabPane>
          <TabPane tab="虚拟" key="2">
            <Row>
              <Col lg={12}>
                <TableExpand
                  {...config2}
                  refresh={this.state.refreshTable2}
                  onRefreshEnd={() => {
                    this.setState({refreshTable2: false});
                  }}
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Recorduuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  Recorduuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Record);
