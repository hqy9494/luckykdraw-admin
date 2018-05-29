import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Tenant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {
    this.props.rts(
      {
        method: "post",
        url: `/awards`,
        data: { ...values, type: "material" }
      },
      this.uuid,
      "submitNew",
      () => {
        this.setState({ refreshTable: true, visible: false });
      }
    );
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awards"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ visible: true });
          }
        }
      ],
      search: {},
      columns: [
        {
          title: "名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "描述",
          dataIndex: "description",
          key: "description"
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: (text, record) => {
            if (text === "material") {
              return "实物";
            } else {
              return "虚拟";
            }
          }
        },
        {
          title: "面额",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            if (text) {
              return "启用";
            } else {
              return "禁用";
            }
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
          title="新建"
          onCancel={() => {
            this.setState({ visible: false });
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "text",
                field: "name",
                label: "名称",
                params: {
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "description",
                label: "描述"
              },
              {
                type: "number",
                field: "value",
                label: "面额",
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

const Tenantuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  Tenantuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Tenant);
