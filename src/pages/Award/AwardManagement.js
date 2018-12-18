import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, Popconfirm } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class AwardManagement extends React.Component {
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

  getClassLevels = (id, value) => {
    this.props.rts({
      url: `/ClassLevels/${id}`,
      method: 'get',
    }, this.uuid, 'getClassLevels', (v) => {
      let params = v
      params.enable = value
      this.putClassLevels(id, params)
    })
  }



  handleEnable = (id, value) => {
    this.getClassLevels(id, !value)
  }
  

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

  handleEdit = (id) => this.props.to(`${this.props.match.url}/detail/${id}`)

  render() {
    const { type } = this.props;

    const bpStatus = {
      'ALL': '全屏爆屏',
      'BANNER': 'Banner爆屏',
      'SUBTITLE': '弹幕'
    }

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
        data: "/ClassLevels",
        total: "/ClassLevels/count"
      },
      buttons: [
        {
          title: "添加",
          onClick: () => {this.props.to(`${this.props.match.url}/detail/add`)}
        }
      ],
      // search: [{
      //   type: "field",
      //   field: "name",
      //   title: "奖品级别",
      //   options:[
      //     {title: "直属代理", value: true},
      //     {title: "一般代理", value: false}
      //   ]
      // },{
      //   type: "field",
      //   field: "value",
      //   title: "中奖机制"
      // },{
      //   type: "option",
      //   field: "value",
      //   title: "机制状态",
      //   options:[
      //     {title: "直属代理", value: true},
      //     {title: "一般代理", value: false}
      //   ]
      // },{
      //   type: "option",
      //   field: "value",
      //   title: "爆屏状态",
      //   options:[
      //     {title: "Banner弹幕", value: true},
      //     {title: "Banner爆屏", value: false},
      //     {title: "全屏爆屏", value: false},
      //   ]
      // }],
      columns: [
        {
          title: "奖品级别",
          dataIndex: "name",
          key: "name",
          // render: text => <img src={text} alt="商品图片" height="80" />
        },
        {
          title: "中奖机制",
          dataIndex: "currentDividend",
          key: "currentDividend",
        },
        {
          title: "机制状态",
          dataIndex: "enable",
          key: "enable",
          render: text => {
            if (text) {
              return "启用";
            } else {
              return "禁用";
            }
          }
        },
        {
          title: "爆屏状态",
          dataIndex: "bpStatus",
          key: "bpStatus",
          render: text => <span> {bpStatus[text]}</span>
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: 'date',
          sort: true
        },
        {
          title: "排序",
          dataIndex: "order",
          key: "order",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button type="primary" size="small" onClick={()=> this.handleEdit(record.id)}>编辑</Button>
                <Divider type="vertical" />
              <Popconfirm
                title={`是否${record.enable ? "禁用" : "开启"}${
                  record.name
                }奖项设置`}
                onConfirm={() => { this.handleEnable(record.id, record.enable) }}
                okText="是"
                cancelText="否"
              >
                 {
                   record.enable ? 
                  <Button style={{background: '#c9c9c9', color: '#fff'}} size="small">禁用</Button> :
                  <Button style={{background: '#FF6699', color: '#fff'}} size="small">开启</Button>
                 }
              </Popconfirm>
                <Divider type="vertical" />
              {/* <Popconfirm
                title={`确认删除${record.name || ''}奖品?`}
                onConfirm={() => { this.isDelete(record.id) }}
                okText="是"
                cancelText="否"
              >
                <Button type="danger" size="small">删除</Button>
              </Popconfirm> */}
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
              // {
              //   type: "number",
              //   field: "value",
              //   label: "面额",
              //   params: {
              //     initialValue: this.state.curRow && this.state.curRow.value,
              //     rules: [{ required: true, message: "必填项" }]
              //   }
              // },
              // {
              //   type: "number",
              //   field: "inventory",
              //   label: "库存",
              //   params: {
              //     initialValue:
              //       this.state.curRow && this.state.curRow.inventory,
              //     rules: [{ required: true, message: "必填项" }]
              //   },
              //   disabled:
              //     this.state.curRow && this.state.curRow.type !== "material"
              // }
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

const AwardManagementuuid = state => state.get("rts").get("uuid");
const type = state => state.get("rts").get("type");

const mapStateToProps = createStructuredSelector({
  AwardManagementuuid,
  type
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardManagement);
