import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, Popconfirm, message } from "antd";
import TableExpand from "../../components/TableExpand";

export class AwardAgainList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      levelList: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  putVoucherAwards = (id, params) => {
    this.props.rts({
      url: `/VoucherAwards/${id}`,
      method: 'patch',
      data: params
    }, this.uuid, 'putVoucherAwards', () => {
      message.success('修改成功', 2, () => {
        window.location.reload()
      })
    })
  }

  getLevels = () => {
    this.props.rts({
      method: "get",
      url: "/ClassLevels"
    },this.uuid, "getLevels", (v) => {
      this.setState({
        levelList: v
      })
    });
  }

  handleEnable = (id, value) => {
    this.getVoucherAwards(id, !value)
  }

  getVoucherAwards = (id, value) => {
    this.props.rts({
      url: `/VoucherAwards/${id}`,
      method: 'get',
    }, this.uuid, 'getVoucherAwards', (v) => {
      let params = v
      params.enable = value
      this.putVoucherAwards(id, params)
    })
  }
  
  handleEdit = (id) => this.props.to(`${this.props.match.url}/detail/${id}`)

  handleDelete = (id) => {
    this.props.rts({
      url: `/VoucherAwards/${id}`,
      method: 'delete',
    }, this.uuid, 'handleDelete', () => {
      message.success('删除成功', 2, () => {
        window.location.reload()
      })
    })
  }

  render() {
    
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/VoucherAwards",
        total: "/VoucherAwards/count"
      },
      search: [{
        type: "field",
        field: "name",
        title: "活动名称",
      },{
        type: "options",
        field: "enable",
        title: "状态",
        option: [
          {title: '开启', value: true},
          {title: '禁用', value: false}
        ]
      }],
      columns: [
        {
          title: "活动名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "活动时间",
          dataIndex: "startTime",
          key: "startTime",
          type: 'date',
          sort: true
        },
        {
          title: "状态",
          dataIndex: "enable",
          key: "enable",
          render: text => <span>{text ? '开启' : '禁用'}</span>
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button type="primary" size="small" onClick={()=> this.handleEdit(record.id)}>编辑</Button>
              <Divider type="vertical" />
              <Popconfirm
                title={`是否${record.enable ? "禁用" : "开启"}${
                  record.name
                }奖项设置`}
                onConfirm={() => { this.handleEnable(record.id, record.enable) }}
                okText="是"
                cancelText="否"
              >
                 {
                   record.enable ? 
                  <Button style={{background: '#c9c9c9', color: '#fff'}} size="small">禁用</Button> :
                  <Button style={{background: '#FF6699', color: '#fff'}} size="small">开启</Button>
                 }
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title={`是否删除${
                  record.name
                }奖项设置`}
                onConfirm={() => { this.handleDelete(record.id) }}
                okText="是"
                cancelText="否"
              >
                <Button type="danger" size="small">删除</Button>
              </Popconfirm>
            </span>
          )
        }
      ]
    };

    return (
      <section>
        <Button onClick={() => {this.props.to(`${this.props.match.url}/detail/add`)}} style={{marginBottom: '5px'}}>新建</Button>
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
        </Grid>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const AwardAgainListuuid = state => state.get("rts").get("uuid");
const getLevels = state => state.get("rts").get("getLevels");

const mapStateToProps = createStructuredSelector({
  AwardAgainListuuid,
  getLevels
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardAgainList);
