import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Select, Table, Pagination, Modal } from "antd"
import { Input } from 'antd';

const Search = Input.Search;

export class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getStaff();
    this.getAwards();
  }

  componentWillReceiveProps(nextProps) {}

  getStaff = (page, nickname) => {
    page = page || 0;
    let url = nickname ? `/accounts/getUserByBuyTimes?page=${page}&limit=10&nickname=${nickname}` : `/accounts/getUserByBuyTimes?page=${page}&limit=10`;
    this.props.rts(
      {
        method: "get",
        url: url
      },
      this.uuid,
      "users",
      users => {
        this.setState({ users });
      }
    );
  };

  getAwards = () => {
    this.props.rts(
      {
        method: "get",
        url: `/BuyTimesAwards`
      },
      this.uuid,
      "awards",
      awards => {
        this.setState({ awards });
      }
    );
  };

  sendAward = () => {
    this.props.rts(
      {
        method: "post",
        url: `/BuyTimesAwardRecords`,
        params: {
          awardId: this.state.awardId,
          userId: this.state.data && this.state.data.userId
        }
      },
      this.uuid,
      "sendAward",
      res => {
        this.getStaff();
        this.setState({visible: false})
      }
    );
  };

  render() {

    const columns = [{
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: "center",
      render: (v) => {
        return v || "未关注用户"
      }
    }, {
      title: '购买盒数',
      dataIndex: 'count',
      key: 'count',
      align: "center",
      render: (v) => {
        return v || 0
      }
    }, {
      title: '大奖领取次数',
      dataIndex: 'buyTimesAwardRecordCount',
      key: 'buyTimesAwardRecordCount',
      align: "center"
    }, {
      title: '操作',
      dataIndex: 'birthday',
      key: 'birthday',
      align: "center",
      render: (v, a) => {
        return (
          <div>
            <a href="javascript:;" onClick={() => {this.props.to(`/buyTimesAward/userList/${a.userId}`)}}>购买列表</a>
            <div class="ant-divider ant-divider-vertical"></div>
            <a href="javascript:;" onClick={() => {this.setState({visible: true, data: {userId: a.userId, userName: a.nickname}})}}>设置大奖</a>
          </div>
        )
      }
    }];

    let { users, awards, awardId } = this.state;
    awards = awards || [];
    return (
      <Grid fluid>
        <Search
          placeholder="请输入用户昵称"
          onSearch={value => this.getStaff(0, value)}
          style={{ width: 200, float: "right", margin: 10 }}
        />
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table columns={columns} dataSource={users && users.users || []} pagination={false} />
              <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getStaff(page-1)}} total={users && users.count} />
            </div>
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title={(`给${this.state.data && this.state.data.userName}派发奖品`)}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          onOk={() => {
            this.sendAward()
          }}
        >
          <Select
            style={{ width: 200, marginBottom: 10 }}
            defaultValue={awardId}
            onChange={value => {
              this.setState({awardId: value})
            }}
            placeholder={"请选择大奖奖品"}
          >
            {awards.map(o => (
              <Option key={o.id} value={o.id}>
                {o.name}
              </Option>
            ))}
          </Select>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
