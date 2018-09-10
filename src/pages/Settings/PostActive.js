import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm, Select } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import moment from "moment"

export class PostActive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      type: 1
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
          url: `/PostActives/${this.state.curRow.id}`,
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
          url: `/PostActives`,
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

  delete=(id)=>{
    this.props.rts(
      {
        method: "delete",
        url: `/PostActives/${id}`
      },
      this.uuid,
      "delete",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/PostActives`,
        total: "/PostActives/count"
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
          title: "活动名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "图片",
          dataIndex: "image",
          key: "image",
          render: text => {
            return <div>
              {
                <img src={text} alt="图片" height="60" style={{float: "left", marginLeft: 10}} />
              }
            </div>
          }
        },
        {
          title: "活动链接",
          dataIndex: "url",
          key: "url"
        },
        {
          title: "新增时间",
          dataIndex: "createdAt",
          key: "createdAt",
          render: v => {
            return moment(v).format("YYYY-MM-DD HH:mm")
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Popconfirm title="确定删除此活动" onConfirm={()=>{this.delete(record.id)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  删除
                </a>
              </Popconfirm>
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
          title={`${this.state.curRow && this.state.curRow.name}活动` || "新建活动"}
          onCancel={() => {
            this.setState({ visible: false });
            window.location.reload();
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "picture",
                field: "image",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                    this.state.curRow.image,
                  rules: [{ required: true, message: "必填项" }]
                },
                upload: "/api/files/upload"
              },
              {
                type: "text",
                field: "name",
                label: "活动名称",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.name
                }
              },
              {
                type: "text",
                field: "url",
                label: "活动链接",
                params: {
                  initialValue:
                  this.state.curRow && this.state.curRow.url
                }
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

const Evaluateuuid = state => state.get("rts").get("uuid")

const mapStateToProps = createStructuredSelector({
  Evaluateuuid,
});

export default connect(mapStateToProps, mapDispatchToProps)(PostActive);
