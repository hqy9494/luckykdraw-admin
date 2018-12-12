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
      visible: false,
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    // this.getStaff();
    this.getAwards();
  }

  componentWillReceiveProps(nextProps) {}

  getStaff = (value, page) => {
    if (!value) {
      this.setState({ users: [] });
      return
    }
    page = page || 0;
    let key = "nickname";
    if (value.length === 28) {
      key = "openid"
    }
    let where = {};
    where[key] = value;
    this.setState({ value });

    this.props.rts(
      {
        method: "get",
        url: "/accounts/getUserByBuyTimes",
        params: {filter: { where, skip: page*10 }}
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
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      align: "center",
      render: (v) => {
        return v === "1" ? "男" : (v === "2" ? "女" : "未知")
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
            <a href="javascript:;" onClick={() => {this.props.to(`/buyTimesAward/userList/${a.id}`)}}>购买列表</a>
            <div class="ant-divider ant-divider-vertical"></div>
            <a href="javascript:;" onClick={() => {this.setState({visible: true, data: {userId: a.id, userName: a.nickname}})}}>设置大奖</a>
          </div>
        )
      }
    }];

    let { users, awards, awardId } = this.state;
    awards = awards || [];
    return (
      <Grid fluid>
        <Search
          placeholder="微信昵称/openid"
          onSearch={value => this.getStaff(value)}
          style={{ width: 300, float: "right", margin: 10 }}
          enterButton
        />
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table columns={columns} dataSource={users && users.users || []} pagination={false} />
              <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getStaff(this.state.value, page-1)}} total={users && users.count} />
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
          cancelText="取消"
          okText="确认派发"
        >
          <span>
            你确定要设置用户{this.state.data && this.state.data.userName}中奖吗？<br/>
            请注意：设置后，用户将会在下次抽奖中获得如下奖品，请慎重设置。
            <br/>
            <br/>
          </span>
          <Select
            showSearch
            style={{ width: 200, marginBottom: 10 }}
            defaultValue={awardId}
            onChange={(value, t) => {
              this.setState({awardId: t.key})
            }}
            placeholder={"请选择大奖奖品"}
          >
            {awards.map(o => (
              <Option key={o.id} value={o.name}>
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
