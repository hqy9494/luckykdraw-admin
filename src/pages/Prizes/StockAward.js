import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import {Modal, Tabs, Popconfirm} from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

const TabPane = Tabs.TabPane;

export class StockAward extends React.Component {
  constructor(props) {
    super(props);
    let params = props.params;
    this.state = {
      visible: false,
      selectTabKey: params.tab || "1"
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  check = id => {
    this.props.rts(
      {
        method: "post",
        url: `/stockAwardRecords/check`,
        data: {stockAwardRecordId: id}
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({refreshTable1: true, visible: false});
      }
    );
  };

  render() {
    const boxId = this.props.match && this.props.match.params && this.props.match.params.id;
    const config1 = {
      tab: 1,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/stockAwardRecords/waitCheck?boxId=${boxId}`
      },
      columns: [
        {
          title: "奖品名称",
          dataIndex: "stockAward.name",
          key: "stockAward.name"
        },
        {
          title: "设备名称",
          dataIndex: "box.name",
          key: "box.name"
        },
        {
          title: "位置",
          dataIndex: "location.name",
          key: "location.name"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) =>
          <Popconfirm
            title={"请确认"}
            onConfirm={() => {
              this.check(record.id);
            }}
            okText="是"
            cancelText="否"
          >
            <a
              href="javascript:;"
            >
              加入中奖奖池
            </a>
          </Popconfirm>

        }
      ]
    };

    const config2 = {
      tab: 1,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/stockAwardRecords/checked?boxId=${boxId}`
      },
      columns: [
        {
          title: "奖品名称",
          dataIndex: "stockAward.name",
          key: "stockAward.name"
        },
        {
          title: "设备名称",
          dataIndex: "box.name",
          key: "box.name"
        },
        {
          title: "位置",
          dataIndex: "location.name",
          key: "location.name"
        }
      ]
    };

    return (
      <Grid fluid>
        <Tabs defaultActiveKey="1" activeKey={this.state.selectTabKey} onChange={(activeKey) => {this.props.to(`/prizes/awardSetting/${boxId}?tab=${activeKey}`)}}>
          <TabPane tab="待派送奖" key="1">
            <Row>
              <Col lg={12}>
                <TableExpand
                  tab="1"
                  {...config1}
                  path={`${this.props.match.path}`}
                  replace={this.props.replace}
                  refresh={this.state.refreshTable1}
                  onRefreshEnd={() => {
                    this.setState({refreshTable1: false});
                  }}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="已确认奖项" key="2">
            <Row>
              <Col lg={12}>
                <TableExpand
                  {...config2}
                  tab="2"
                  path={`${this.props.match.path}`}
                  replace={this.props.replace}
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

export default connect(mapStateToProps, mapDispatchToProps)(StockAward);
