import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Select, Table, Pagination } from "antd"

export class UserBuyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getStaff();
  }

  componentWillReceiveProps(nextProps) {}

  getStaff = (page) => {
    page = page || 0;
    let id = this.props.match.params.id;
    this.props.rts(
      {
        method: "get",
        url: `/accounts/getBuyList?userId=${id}&page=${page}&limit=10`
      },
      this.uuid,
      "list",
      list => {
        this.setState({ list });
      }
    );
  };

  render() {

    const columns = [{
      title: '购买时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: "center",
      render: (v) => {
        return moment(v).format("YYYY-MM-DD HH:mm:SS")
      }
    }, {
      title: '设备名称',
      dataIndex: 'box',
      key: 'box',
      align: "center",
      render: (v) => {
        return v && v.name
      }
    }, {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      align: "center",
      render: (v) => {
        return v && v.name
      }
    }, {
      title: '奖品类型',
      dataIndex: 'award',
      key: 'award',
      align: "center",
      render: (v) => {
        return v && v.name
      }
    }, {
      title: '奖品金额',
      dataIndex: 'value',
      key: 'value',
      align: "center"
    }];

    let { list } = this.state;
    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table columns={columns} dataSource={list && list.awardRecords || []} pagination={false} />
              <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getStaff(page-1)}} total={list && list.count} />
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

export default connect(mapStateToProps, mapDispatchToProps)(UserBuyList);
