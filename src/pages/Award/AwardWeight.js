import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, message,Form,Input,Popover, InputNumber } from "antd";
import TableExpand from "../../components/AsyncTable";
import FormExpand from "../../components/FormExpand";
import "../DefineAward/DefineAwardList.scss";
import moment from "../../components/Moment";
let timer = null; 
export class AwardWeight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      status:"add",
      sendSecond:120,
      classLevelDetail: {},
      selectAllId:[],
      AwardTypesList: [],
      awardList: [],
      isErr: false
    };
    this.uuid = uuid.v1();
  }
  componentWillMount(){
    const { match } = this.props
    const id = match.params.id 
    if(id) {
      this.getClassLevels(id);
    }
    this.getAwardTypes()
    this.getClassPercent()
  }
  //获取中奖列表详情
  getClassLevels = (id) => {
    id && this.props.rts({
      method: 'get',
      url: `/ClassLevels/${id}`
    }, this.uuid, 'getClassLevels', (res = {}) => {
      this.setState({
        classLevelDetail: res
      });
    });
  }

  getClassPercent = () => {
    this.props.rts({
      method: 'get',
      url: `/classAwards`
    }, this.uuid, 'getClassPercent', (res = {}) => {
      this.setState({
        classPercent: this.getPercent(res)
      });
    });
  }

  getPercent = (res) => {
    const num = res && Array.isArray(res) && res.reduce((a, c) => {
      if(c && c.weight) {
        a += isNaN(c.weight) ? 0 : Number(c.weight)
      }
      return a
    }, 0) || 0
    
    return num
  }

  // 获取中奖列表名称
  getClassLevelsName = (id) => {
    const {classLevelDetail} = this.state;

    if(classLevelDetail && classLevelDetail.id && classLevelDetail.id === id) {
      return classLevelDetail.name
    }
    return ''
  }

  // 获取奖品类型
  getAwardTypes = () => {
    this.props.rts({
      method: 'get',
      url: `/classAwards/getAwardTypes`
    }, this.uuid, 'getAwardTypes', (res = {}) => {
      this.setState({
        AwardTypesList: res,
        awardList: this.turnOption(res)
      });
    });
  }

  // 将列表转为option类型
  turnOption = (res) => {
    return res && Array.isArray(res) && res.map(v => {
      return {
        value: v.type,
        title: v.name
      }
    }) || []
  }
  
  //显示弹窗
  showModal = (type, record) => {
    this.setState({
      status: type,
      curRow: record
    }, () => {
      this.setState({
        visible: true,
      })
    });
  }
  

  //切换中奖
  changeAward = () => {
    let { curRow } = this.state

    this.props.form.validateFields((err, values) => {
      if(!err) {
        let params = {}
        for(let i of Object.keys(values)) {
          if (values[i] == null) continue
          params[i] = values[i]
        }
        params = Object.assign({}, {...curRow}, {...params})
        
        if(curRow && curRow.id) {
          this.props.rts({
            method: 'patch',
            url: `/classAwards/${curRow.id}`,
            data: params,
          }, this.uuid, 'changeAward', (res = {}) => {
            this.setState({ 
              refreshTable: true,
              visible: false,
              curRow: {}
            }, () => {
              this.props.form.resetFields(['weight'])
              message.success("修改成功");
            });
          });
        }
      }
    });
  }
  render() {
    const { match } = this.props
    const classLevelId = match.params && match.params.id || ''
    // const rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     this.setState({selectAllId:selectedRowKeys});
    //   },
    //   getCheckboxProps: record => ({
    //     disabled:!(record.editable === true && record.enable === false), // Column configuration not to be checked
    //     name: record.name,
    //   }),
    // };
    const { getFieldDecorator } = this.props.form;
    const { visible, status, AwardTypesList, classPercent, awardList, classLevelDetail } = this.state;
    const statusTitle = {add:"发布",edit: "撤销"}
    const config = {
      // rowSelection:rowSelection,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/classAwards",
        total: "/classAwards/count",
        where: {
          classLevelId
        }
      },
      search: [
        {
          type: "field",
          field: "name",
          title: "奖品名称",
        },
        {
          type: "option",
          field: "type",
          title: "奖品类型",
          options: awardList,
        },
    ],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "奖品权重",
          dataIndex: "weight",
          key: "weight",
          render:(test)=>{
            return test || "未设置奖品权重";
          }
        },
        {
          title: "权重比例",
          dataIndex: "classPercent",
          key: "classPercent",
          render:(test, record) =>{
            
            if(!classPercent) {
              return '0.00%'
            }
            return record.weight && `${(record.weight / classPercent).toFixed(2)}%` || '0.00%';
          }
        },
        {
          title: "奖品类型",
          dataIndex: "type",
          key: "type",
          render:(type) => {
            const awardType = AwardTypesList.filter(v => type === v.type) 
            return awardType && awardType[0] && awardType[0].name || '---'
          }
        },
        {
          title: "奖品级别",
          dataIndex: "level",
          key: "level",
          render:(test)=> {
            return classLevelDetail && classLevelDetail.name || '---'
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            return <Button type="primary" size="small" onClick={()=> this.showModal("edit", record)}>设置</Button>
          }
        }
      ]
    };
    return (
      <section className="DefineAwardList">
        <Grid fluid>
          <Row>
            <Col lg={12}>
              <Button onClick={() => {this.props.goBack()}} style={{marginBottom: '5px',marginLeft:"15px"}} type="primary" size="small">返回</Button>
              <TableExpand
                {...config}
                path={`${this.props.match.url}`}
                replace={this.props.replace}
                refresh={this.state.refreshTable}
                onRefreshEnd={() => {
                  this.setState({ refreshTable: false });
                }}
                removeHeader
              />
            </Col>
          </Row>
        </Grid>
        <Modal
          title={'设置权重'}
          visible={visible}
          onOk={this.changeAward}
          cancelText="取消"
          okText="确定"
          onCancel={()=> {
            if(this.props.form.getFieldValue('weight')) {
              this.setState({
                visible: false,
              },() => {
                this.setState({
                  curRow: {}
                })
                this.props.form.resetFields(['weight'])
              })
            }
        }}
        >
          <div>
            <Form.Item label="奖品权重" style={{display: 'flex'}}>
              {getFieldDecorator('weight', {
                initialValue: this.state.curRow && this.state.curRow.weight || 1,
                rules: [{ required: true, message: "必填项" }]
              })(
                <InputNumber min={1} style={{width: "300px"}}/>
              )}
            </Form.Item>
          </div>
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const AwardAgainListuuid = state => state.get("rts").get("uuid");
const getLevels = state => state.get("rts").get("getLevels");

const mapStateToProps = createStructuredSelector({
  AwardAgainListuuid,
  getLevels
});
const WrappeAwardWeight = Form.create()(AwardWeight);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeAwardWeight);
