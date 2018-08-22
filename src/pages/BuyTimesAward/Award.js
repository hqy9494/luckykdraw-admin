import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Award extends React.Component {
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

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/BuyTimesAwards/${this.state.curRow.id}`,
          data: {...values,img: values.img[0]}
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
          url: `/BuyTimesAwards`,
          data: {...values,img: values.img[0]}
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
          // window.location.reload();
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
        data: "/BuyTimesAwards"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      columns: [
        {
          title: "奖品图",
          dataIndex: "img",
          key: "img",
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
          title: "价格",
          dataIndex: "price",
          key: "price"
        },
        {
          title: "成本",
          dataIndex: "cost",
          key: "cost"
        },
        {
          title: "库存",
          dataIndex: "inventory",
          key: "inventory"
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
                field: "img",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                  this.state.curRow.img && [
                    this.state.curRow.img
                  ],
                  rules: [{ required: true, message: "必填项" }]
                },
                upload: "/api/files/upload"
              },
              {
                type: "number",
                field: "price",
                label: "面额",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.price,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "cost",
                label: "成本价",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.cost,
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
                }
              }
            ]}
            onSubmit={values => {
              // console.log(values);
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

const PrizeShiwuuuid = state => state.get("rts").get("uuid");
const type = state => state.get("rts").get("type");

const mapStateToProps = createStructuredSelector({
  PrizeShiwuuuid,
  type
});

export default connect(mapStateToProps, mapDispatchToProps)(Award);
