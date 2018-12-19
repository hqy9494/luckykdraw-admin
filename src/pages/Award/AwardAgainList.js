import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, Popconfirm, message } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

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

  componentWillMount() {
    
  }

  componentWillReceiveProps(nextProps) {}

  putClassLevels = (id, params) => {
    this.props.rts({
      url: `/ClassLevels/${id}`,
      method: 'put',
      data: params
    }, this.uuid, 'putClassLevels', () => {
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
    this.getClassLevels(id, !value)
  }
  
  handleEdit = (id) => this.props.to(`${this.props.match.url}/detail/${id}`)

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
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button type="primary" size="small" onClick={()=> this.handleEdit(record.id)}>编辑</Button>
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
