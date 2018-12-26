import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, message,Form,Input,Popover } from "antd";
import TableExpand from "../../components/AsyncTable";
import "./DefineAwardList.scss";
import { isArray } from "util";
let timer = null; 
export class DefineAwardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      status:"add",
      sendSecond:120
    };
    this.uuid = uuid.v1();
  }
  /*componentWillMount(){
    this.
  }*/
  //显示弹窗
  showModal = (type) => {
    this.setState({visible:true,status:type});
  }
  
  sendVerification = () =>{
    this.props.form.validateFields((err, values) => {
      if(values.phone){
        this.props.rts(
          {
            method: 'post',
            url: "/systems/switchAddPredict",
            params: values
          },
          this.uuid,
          'searchData',
          (res = {}) => {
            timer = setInterval(()=>{
              let { sendSecond } = this.state;
              if(--sendSecond === 0){
                clearInterval(timer);
                sendSecond = 120;
              }
              this.setState({sendSecond});
            }
            ,1000);
            message.success("发送成功！请注意接收验证码！");
          });
      }
    });
  }
  //验证状态
  returnStatus = (obj = {}) =>{
    const { enable,received,editable } = obj;
    if(editable){
      if(enable){
        if(received){
          return {name:"已中奖",value:"award"};
        }else{
          return {name:"待领取",value:"unReceive"};
        }
      }else{
        return {name:"待发布",value:"unPost"};
      }
    }else{
      return {name:"已取消",value:"cancel"};
    }
  }
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { getFieldDecorator } = this.props.form;
    const { visible,status,sendSecond } = this.state;
    // const statusTitle = {1:"待发布",2:"待领取",3:"已中奖",4:"已取消"}
    const statusTitle = {add:"发布",remove:"撤销"}
    const statusContent = {
      unPost:<div>
        <Button type="primary" size="small" onClick={()=>this.showModal("remove")}>撤销</Button>
        <Divider type="vertical" />
        <Button style={{background: '#c9c9c9', color: '#fff'}} size="small" onClick={()=>this.showModal("add")}>发布</Button>
        <Divider type="vertical" />
        <Button type="danger" size="small">编辑</Button>
      </div>,
      unReceive:<div><Button type="primary" size="small" onClick={()=>this.showModal("remove")}>撤销</Button></div>,
      award:<div>--</div>,
      cancel:<div>--</div>,
    }
    const config = {
      rowSelection:rowSelection,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/classAppointRecords/getAll",
        total: "/classAppointRecords/count",
        include:["user","classAward","bingoBox"],
      },
      search: [
        {
        type: "field",
        field: "name",
        title: "奖品名称",
      },{
        type: "option",
        field: "enable",
        title: "状态",
        option: [
          {title: '开启', value: true},
          {title: '禁用', value: false}
        ]
      }],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "classAward.name",
          key: "classAward.name",
        },
        {
          title: "定向人手机号",
          dataIndex: "mobile",
          key: "mobile",
          render:(test)=>{
            return test || "未绑定";
          }
        },
        {
          title: "抽奖人名称",
          dataIndex: "user.nickname",
          key: "user.nickname",
          render:(test)=>{
            return test || "手机未绑定用户";
          }
        },
        {
          title: "定向设备",
          dataIndex: "boxes",
          key: "boxes",
          render:(boxes) =>{
            const content = (
              <div>
                {boxes && boxes.map((item,i)=>{
                  return  <div key={i}>定向设备名称：{item.name}</div>
                })}
              </div>
            );
            let str = "";
            boxes && boxes.map((item,i)=>{
              str+=item.name+",";
            });
            str = str.substr(0,str.length-1);
            return (
              <Popover content={content} trigger="click" placement="bottomLeft">
                <span style={{cursor:'pointer'}}>{str==""?"---":str.length>6?str.substr(0,6)+"...":str}</span>
              </Popover>)
          }
        },
        {
          title: "出奖点位",
          dataIndex: "bingoBox.name",
          key: "bingoBox.name",
          render:(test)=>{
            return test || "尚未领奖";
          }
        },
        {
          title: "开始时间",
          dataIndex: "startTime",
          key: "startTime",
          type: 'date',
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          type: 'date',
        },
        {
          title: "出奖概率",
          dataIndex: "probability",
          key: "probability",
          align:"right",
          render:(test)=>{
            return <div>{(test || 0)+"%"}</div>
          }
        },
        {
          title: "状态",
          key: "enable",
          render: (text,list) => {
           return  <span>{this.returnStatus(list).name}</span>
        }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            const value = this.returnStatus(record).value;
            return <span>
              {statusContent[value]}
            </span>
          }
        }
      ]
    };
    return (
      <section className="DefineAwardList">
        <Grid fluid>
          <Row>
            <Col lg={12}>
              <Button onClick={() => {this.props.to(`${this.props.match.url}/detail/add`)}} style={{marginBottom: '5px'}}>新建</Button>
              <TableExpand
                {...config}
                path={`${this.props.match.path}`}
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
          className="DefineAwardList"
          title={statusTitle[status]}
          visible={visible}
          onOk={()=>console.log("success")}
          cancelText="取消"
          okText="确定"
          onCancel={()=>this.setState({visible:false})}
        >
          <div>
            <Form.Item
              label="手机号"
            >
              {getFieldDecorator('phone', {
                initialValue:"17875512017"
              })(
                <Input disabled/>
              )}
            </Form.Item>
            <Form.Item
              label="验证码"
            >
              {getFieldDecorator('vscode')(
                <Input />
              )}
              <Button onClick={this.sendVerification} disabled={sendSecond=="120"?false:true}>{sendSecond=="120"?"获取验证码":sendSecond+"s重试"}</Button>
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
const WrappeDefineAwardList = Form.create()(DefineAwardList);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeDefineAwardList);
