import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm, Button } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class AwardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      typeList: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getType();
  }

  componentWillReceiveProps(nextProps) {}

  getType = () => {
    this.props.rts({
      method: "get",
      url: "/classAwards/getAwardTypes"
    },this.uuid, "getType", (v) => {
      this.setState({
        typeList: v
      })
    });
  };

  turnType = (type) => {
    if(!type) return ''
    
    const {typeList} = this.state;

    const typeName = typeList.filter(v => v.type == type)

    return typeName[0].name
  }

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "post",
          url: "/boxStock/bind",
          data: {
            boxId: this.state.curRow.id,
            stockAwardId: values.stockAwardId
          }
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
        }
      );
    } else {
    }
  };

  submitEnabled = (boxId, ifEnable) => {
    if (boxId) {
      this.props.rts(
        {
          method: "post",
          url: "/boxStock/switch",
          data: {
            boxId,
            ifEnable
          }
        },
        this.uuid,
        "submitEnabled",
        () => {
          this.setState({ refreshTable: true });
        }
      );
    }
  };

  handleEdit = (id) => {
    this.props.to(`${this.props.match.url}/detail/${id}`)
  }

  isDelete = (id) => {

  }

  render() {
    const { type } = this.props;
    let typeList = [];

    if (type && type[this.uuid]) {
      typeList = type[this.uuid].map(t => {
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
        data: "/classAwards",
        total: "/classAwards/count"
      },
      buttons: [{
        title: '新建',
        onClick: () => this.props.to(`${this.props.match.url}/detail/add`)
      }],
      // search: [{
      //   type: "field",
      //   field: "name",
      //   title: "奖品名称"
      // },{
      //   type: "number",
      //   field: "price",
      //   title: "奖品价格"
      // },{
      //   type: "option",
      //   field: "classLevelId",
      //   title: "奖品级别",
      //   options:[
      //     {title: "直属代理", value: true},
      //     {title: "一般代理", value: false}
      //   ]
      // },{
      //   type: "number",
      //   field: "cost",
      //   title: "奖品成本"
      // },{
      //   type: "option",
      //   field: "value",
      //   title: "奖品类型",
      //   options:[
      //     {title: "实物奖", value: 'METARIAL'},
      //     {title: "优惠券", value: 'COUPON'},
      //     {title: "红包", value: 'RED_PACKET'},
      //   ]
      // }],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "奖品图片",
          dataIndex: "picture",
          key: "picture",
          render: text => <img src={text} alt="商品图片" height="80" />
        },
        // {
        //   title: "奖品级别",
        //   dataIndex: "classLevelId",
        //   key: "classLevelId"
        // },
        {
          title: "价格",
          dataIndex: "price",
          key: "price",
          render: text => <span> {isNaN(text) ? 0 : Number(text / 100).toFixed(2)}</span>
        },
        {
          title: "成本",
          dataIndex: "cost",
          key: "cost",
          render: text => <span> {isNaN(text) ? 0 : Number(text / 100).toFixed(2)}</span>
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: text => <span> {this.turnType(text)}</span>
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit"
        },
        {
          title: "创建时间",
          type: 'date',
          dataIndex: "createdAt",
          key: "createdAt",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let boxStock = record.boxStock ? record.boxStock : {};
            return (
              <span>
                <Button type="primary" size="small" onClick={()=> this.handleEdit(record.id)}>编辑</Button>
                {/* <Divider type="vertical" />
                <Popconfirm
                  title={`确认删除${record.name || ''}奖品?`}
                  onConfirm={() => { this.isDelete(record.id) }}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="danger" size="small">删除</Button>
                </Popconfirm> */}
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
                label: "实物奖项",
                field: "stockAwardId",
                type: "select",
                options: typeList,
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

const AwardListuuid = state => state.get("rts").get("uuid");
const getType = state => state.get("rts").get("getType");

const mapStateToProps = createStructuredSelector({
  AwardListuuid,
  getType
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AwardList);
