import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Divider, Popconfirm, Modal } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class PrizeCoupon extends React.Component {
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
    if (this.state.curRow && this.state.curRow.id) {
    } else {
    }
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
            this.setState({ visible: true, curRow: null });
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "图片",
          dataIndex: "mainImg",
          key: "mainImg",
          render: text => (
            <img
              src={text}
              alt="商品图片"
              title="点击放大"
              height="80"
              onClick={() => {
                this.setState({ previewVisible: true, previewImage: text });
              }}
            />
          )
        },
        {
          title: "标题",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span title={record.description}>{text}</span>
          )
        },
        {
          title: "现价",
          dataIndex: "a1",
          key: "a1"
        },
        {
          title: "原价",
          dataIndex: "a2",
          key: "a3"
        },
        {
          title: "淘口令",
          dataIndex: "a4",
          key: "a5"
        },
        {
          title: "url",
          dataIndex: "url",
          key: "url"
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
                label: "标题",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.name,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "pictureUrl",
                label: "图片",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.pictureUrl,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "a1",
                label: "原价",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.a1,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "number",
                field: "a2",
                label: "现价",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.a2,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "a3",
                label: "淘口令",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.a3,
                  rules: [{ required: true, message: "必填项" }]
                }
              },
              {
                type: "text",
                field: "url",
                label: "url",
                params: {
                  initialValue: this.state.curRow && this.state.curRow.a4,
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

const PrizeCouponuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  PrizeCouponuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(PrizeCoupon);
