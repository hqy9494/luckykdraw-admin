import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class Evaluate extends React.Component {
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

  delete=(id)=>{
    this.props.rts(
      {
        method: "delete",
        url: `/posts/${id}`
      },
      this.uuid,
      "delete",
      () => {
        this.setState({ refreshTable: true });
        // window.location.reload();
      }
    );
  }

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/posts",
        total: "/posts/count"
      },
      buttons: [
        // {
        //   title: "添加",
        //   onClick: () => {
        //     this.setState({ visible: true, curRow: null });
        //   }
        // }
      ],
      search: [],
      columns: [
        {
            title: "图片",
            dataIndex: "images",
            key: "images",
            render: text => {
              return <div>
                {
                  text&&text.length>0?text.map((t,i)=> <img key={i} src={t} alt="商品图片" height="60" style={{float: "left", marginLeft: 10}} />):""
                }
              </div>
            }
        },
        {
            title: "内容",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "微信昵称",
            dataIndex: "user.nickname",
            key: "user.nickname"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              {/* <a
                href="javascript:;"
                onClick={() => {
                  this.setState({ curRow: record, visible: true });
                }}
              >
                编辑
              </a>
              <Divider type="vertical" /> */}
              <Popconfirm title="确定删除此条晒单" onConfirm={()=>{this.delete(record.tid)}} okText="是" cancelText="否">
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
          title={`${this.state.curRow && this.state.curRow.user.nickname}的晒单` || "新建晒图"}
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
                field: "mainImage",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                    this.state.curRow.images,
                  rules: [{ required: true, message: "必填项" }]
                },
                upload: "/api/files/upload"
              },
              {
                type: "text",
                field: "title",
                label: "内容",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.title
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

export default connect(mapStateToProps, mapDispatchToProps)(Evaluate);
