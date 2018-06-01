import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import TableExpand from "../../components/TableExpand";
import {Divider, Popconfirm} from "antd";

export class ReplenishmenterApply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  auditToBuhuoyuan(id, approved) {
    this.props.rts(
      {
        method: 'put',
        url: `/replenishmenterapplys/${id}/auditing`,
        data: {approved}
      },
      this.uuid,
      'audit',
      () => {
        this.setState({refreshTable: true});
      }
    );
  }


  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: '/replenishmenterapplys',
        total: '/replenishmenterapplys/count'
      },
      search: [],
      columns: [
        {
          title: "姓名",
          dataIndex: "fullname",
          key: "fullname"
        },
        {
          title: "联系电话",
          dataIndex: "mobile",
          key: "mobile",
        },
        {
          title: "微信昵称",
          dataIndex: "nickname",
          key: "nickname"
        },
        {
          title: "操作",
          dataIndex: "op",
          key: "op",
          render: (text, record) => {
            return (<span>
                    <Popconfirm
                      title="确定添加为补货员？"
                      onConfirm={() => {
                        this.auditToBuhuoyuan(record.id, true);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="javascript:;">同意</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Popconfirm
                      title="确定拒绝为补货员？"
                      onConfirm={() => {
                        this.auditToBuhuoyuan(record.id, false);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="javascript:;">拒绝</a>
                    </Popconfirm>
                  </span>);
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
                this.setState({refreshTable: false});
              }}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const ReplenishmenterApplyuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  ReplenishmenterApplyuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplenishmenterApply);
