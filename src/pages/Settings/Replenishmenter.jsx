import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import { Popconfirm, Modal } from "antd";

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
    this.getTenant();
  }

  componentWillReceiveProps(nextProps) {}

  getTenant = () => {
    this.props.rts(
      {
        method: "get",
        url: `/tenants`
      },
      this.uuid,
      "tenant"
    );
  };

  remove(id) {
    this.props.rts(
      {
        method: "delete",
        url: `/accounts/${id}/replenishmenter`
      },
      this.uuid,
      "audit",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  }

  submitNew(values) {}

  render() {
    const { tenant } = this.props;
    let tenantList = [];

    if (tenant && tenant[this.uuid]) {
      tenantList = tenant[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/accounts/replenishmenters"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "姓名",
          dataIndex: "fullname",
          key: "fullname"
        },
        {
          title: "电话/账号",
          dataIndex: "mobile",
          key: "mobile"
        },
        {
          title: "微信昵称",
          dataIndex: "nickname",
          key: "nickname"
        },
        {
          title: "兑奖中心",
          dataIndex: "tenant",
          key: "tenant"
        },
        {
          title: "操作",
          dataIndex: "op",
          key: "op",
          render: (text, record) => {
            return (
              <span>
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
              </span>
            );
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
                this.setState({ refreshTable: false });
              }}
            />
          </Col>
        </Row>
        <Modal
          visible={this.state.visible}
          title={
            (this.state.curRow && this.state.curRow.fullname) || "添加补货员"
          }
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "text",
                field: "fullname",
                label: "姓名",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "mobile",
                label: "账号/电话",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "password",
                label: "密码",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                label: "兑奖中心",
                field: "tenantId",
                type: "select",
                options: tenantList,
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
            }}
          />
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Replenishmenteruuid = state => state.get("rts").get("uuid");
const tenant = state => state.get("rts").get("tenant");

const mapStateToProps = createStructuredSelector({
  Replenishmenteruuid,
  tenant
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Replenishmenter);
