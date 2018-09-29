import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Select, Table, Pagination } from "antd"

export class AwardRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getRecords();
  }

  componentWillReceiveProps(nextProps) {}

  getRecords = (page) => {
    page = page || 0;
    this.props.rts(
      {
        method: "get",
        url: `/BuyTimesAwardRecords?page=${page}&limit=10`
      },
      this.uuid,
      "records",
      records => {
        this.setState({ records });
      }
    );
  };

  cancelSendAward = (id) => {
    this.props.rts(
      {
        method: "put",
        url: `/BuyTimesAwardRecords`,
        params: {
          buyTimesAwardRecordId: id
        }
      },
      this.uuid,
      "cancel",
      cancel => {
        this.getRecords()
      }
    );
  };

  render() {

    const columns = [{
      title: '用户昵称',
      dataIndex: 'user',
      key: 'user',
      align: "center",
      render: (v) => {
        return v && v.nickname
      }
    }, {
      title: '大奖名称',
      dataIndex: 'buyTimesAward',
      key: 'buyTimesAward',
      align: "center",
      render: v => {
        return v && v.name
      }
    }, {
      title: '设备名称',
      dataIndex: 'box',
      key: 'box',
      align: "center",
      render: v => {
        return v && v.name
      }
    }, {
      title: '领取地址',
      dataIndex: 'location',
      key: 'location',
      align: "center",
      render: v => {
        return v && v.name
      }
    }, {
      title: '是否领取',
      dataIndex: 'received',
      key: 'received',
      align: "center",
      render: v => {
        return v ? "是" : "否"
      }
    }, {
      title: '邮寄地址',
      dataIndex: 'record',
      key: 'record',
      align: "center",
      render: v => {
        return v && v.city + v.address
      }
    }, {
      title: '电话',
      dataIndex: 'birthday2',
      key: 'birthday2',
      align: "center",
      render: (v, r) => {
        return r.record && r.record.userContactMobile
      }
    }, {
      title: '姓名',
      dataIndex: 'birthday4',
      key: 'birthday4',
      align: "center",
      render: (v, r) => {
        return r.record && r.record.userFullname
      }
    }, {
      title: '操作',
      dataIndex: 'birthday',
      key: 'birthday',
      align: "center",
      render: (text, record) => (
        <span>
              <a
                href="javascript:;"
                onClick={() => {
                 this.cancelSendAward(record.id);
                }}
              >
                取消派奖
              </a>
            </span>
      )
    }];

    let { records } = this.state;
    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table columns={columns} dataSource={records && records.records || []} pagination={false} />
              <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getRecords(page-1)}} total={records && records.count} />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const staff = state => state.get("rts").get("staff");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  staff
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardRecord);
