import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import TableExpand from "../../components/TableExpand";
import {Popconfirm} from "antd";

export class Replenishmenter extends React.Component {
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

  remove(id) {
    this.props.rts(
      {
        method: 'delete',
        url: `/accounts/${id}/replenishmenter`
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
        data: '/accounts/replenishmenters',
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
                      title="确定移除补货员？"
                      onConfirm={() => {
                        this.remove(record.id);
                      }}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="javascript:;">移除</a>
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

const Replenishmenteruuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  Replenishmenteruuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Replenishmenter);
