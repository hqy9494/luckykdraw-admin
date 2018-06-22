import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getType();
  }

  componentWillReceiveProps(nextProps) {}

  getType = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awards/types`
      },
      this.uuid,
      "type"
    );
  };

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/awards/${this.state.curRow.id}`,
          data: values
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/awards`,
          data: values
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    }
  };

  render() {
    const { type } = this.props;

    let typeList = [];

    if (type && type[this.uuid]) {
      typeList = type[this.uuid].map(t => {
        return {
          title: t.title,
          value: t.type
        };
      });
    }

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/awards"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "名称"
        },
        {
          type: "number",
          field: "value",
          title: "价格"
        }
      ],
      columns: [
        {
          title: "奖品图",
          dataIndex: "mainImage",
          key: "mainImage",
          render: text => <img src={text} alt="商品图片" height="80" />
        },
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span title={record.description}>{text}</span>
          )
        },
        {
          title: "类型",
          dataIndex: "typeTitle",
          key: "typeTitle"
        },
        {
          title: "价格",
          dataIndex: "value",
          key: "value"
        },
        {
          title: "库存",
          dataIndex: "isInventorySensitive",
          key: "isInventorySensitive",
          render: (text, record) => (text ? record.inventory : "无限")
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
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.setState({ curRow: record, visible: true });
                }}
              >
                编辑
              </a>
            </span>
          )
        }
      ]
    };

    return (
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
        <Modal
          visible={this.state.visible}
          title={(this.state.curRow && this.state.curRow.name) || "添加奖品"}
          onCancel={() => {
            this.setState({ visible: false });
            window.location.reload();
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
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "picture",
                field: "mainImage",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                    this.state.curRow.mainImage && [
                      this.state.curRow.mainImage
                    ],
                  rules: [{ required: true, message: "必填项" }]
                },
                upload: "/api/files/upload"
              },
              {
                label: "类型",
                field: "type",
                type: "select",
                options: typeList,
                params: {
                  initialValue: this.state.curRow && this.state.curRow.type,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "description",
                label: "描述",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.description
                }
              },
              {
                type: "number",
                field: "value",
                label: "面额",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.value,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "inventory",
                label: "库存",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.inventory,
                  rules: [{ required: true, message: "必填项" }]
                },
                disabled:
                  this.state.curRow && this.state.curRow.type !== "material"
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
              window.location.reload();
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

const PrizeBaseuuid = state => state.get("rts").get("uuid");
const type = state => state.get("rts").get("type");

const mapStateToProps = createStructuredSelector({
  PrizeBaseuuid,
  type
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeBase);
