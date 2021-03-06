import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, message,Form,Input,Popover } from "antd";
import TableExpand from "../../components/AsyncTable";
import "./DefineAwardList.scss";
import moment from "../../components/Moment";
let timer = null; 
export class DefineAwardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      status:"add",
      sendSecond:120,
      setPhone:"",
      selectAllId:[]
    };
    this.uuid = uuid.v1();
  }
  componentWillMount(){
    this.getPhone();
  }
  //获取手机号码
  getPhone = () => {
    this.props.rts(
      {
        method: 'get',
        url: "/classAppointRecords/getAppointAwardCheckPhone"
      },
      this.uuid,
      'searchData',
      (res = {}) => {
        this.setState({setPhone:res});
      });
    
  }
  //显示弹窗
  showModal = (type,id) => {
    this.setState({visible:true,status:type,changeAwardId:Array.isArray(id)?id:[id]});
  }
  
  sendVerification = () =>{
    this.props.form.validateFields((err, values) => {
      if(values.mobile){
        this.props.rts(
          {
            method: 'get',
            url: "/verifications/code/send?mobile="+values.mobile,
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
          return {name:"已中奖",value:"award",color:"#3BD7B6"};
        }else{
          return {name:"待领取",value:"unReceive",color:"#459BFC"};
        }
      }else{
        return {name:"待发布",value:"unPost",color:"#3CBCE5"};
      }
    }else{
      return {name:"已取消",value:"cancel",color:"#999"};
    }
  }
  getButton = (type,id) => {
    const statusContent = {
      unPost:<div>
        <Button type="primary" size="small" onClick={()=>this.showModal("add",id)}>发布</Button>
        <Divider type="vertical" />
        <Button size="small" onClick={()=>this.props.to(`${this.props.match.url}/detail/${id}`)}>编辑</Button>
        <Divider type="vertical" />
        <Button type="danger" size="small" onClick={()=>this.showModal("remove",id)}>撤销</Button>
      </div>,
      unReceive:<div><Button type="primary" size="small" onClick={()=>this.showModal("remove",id)}>撤销</Button></div>,
      award:<div>--</div>,
      cancel:<div>--</div>,
    }
    return statusContent[type];
  }
  //切换中奖
  changeAward = () =>{
    this.props.form.validateFields((err, values) => {
      const { changeAwardId,status } = this.state;
      if(values.vscode){
        let postData = {
          code:values.vscode,
          ids: JSON.stringify(changeAwardId)
        };
        if(status==="add"){
          postData.enable = true;
        }else{
          postData.enable = false;
        }
        this.props.rts(
          {
            method: 'post',
            url: "/classAppointRecords/switch",
            params:postData
          },
          this.uuid,
          'searchData',
          (res = {}) => {
            this.setState({ refreshTable: true,visible:false});
            message.success(status==="add"?"发布成功！":"撤销成功！");
          });
      }else{
        message.error("请输入验证码！");
      }
    });
  }
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectAllId:selectedRowKeys});
      },
      getCheckboxProps: record => ({
        disabled:!(record.editable === true && record.enable === false), // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { getFieldDecorator } = this.props.form;
    const { visible,status,sendSecond,setPhone } = this.state;
    // const statusTitle = {1:"待发布",2:"待领取",3:"已中奖",4:"已取消"}
    const statusTitle = {add:"发布",remove:"撤销"}
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
          type: "relevance",
          field: "classAwardId",
          title: "奖品名称",
          model: {
            api: "/classAwards",
            field: "name"
          }
        },
        {
          type: "option",
          field: "userId",
          title: "是否注册",
          options: [
            {title: '是', value: "YES",searchValue:{userId:{neq:[null]}}},
            {title: '否', value: "No",searchValue:{userId:null}}
          ]
        },
        {
          type: "field",
          field: "mobile",
          title: "定向人"
        },
        {
          type: "date",
          field: "startTime",
          title: "开始时间"
        },
        {
          type: "date",
          field: "endTime",
          title: "结束时间"
        },
      {
        type: "option",
        field: "enable",
        title: "状态",
        options: [
          {title: '已中奖', value: "award",searchValue:{enable:true,received:true,editable:true}},
          {title: '待领取', value: "unReceive",searchValue:{enable:true,received:false,editable:true}},
          {title: '待发布', value: "unPost",searchValue:{enable:false,editable:true}},
          {title: '已取消', value: "cancel",searchValue:{editable:false}}
        ]
      }
    ],
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
          render:(test,list)=>{
            return <span style={{color:list.userId?"#3BD7B6":"#ff0000"}}>{test}<br/>{list.userId?"已注册":"未注册"}</span>;
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
          render:(time)=>{
            return time? moment(time).format('YYYY-MM-DD') : "--";
          }
        },
        {
          title: "结束时间",
          dataIndex: "endTime",
          key: "endTime",
          render:(time)=>{
            return time? moment(time).format('YYYY-MM-DD') : "--";
          }
          
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
            const result = this.returnStatus(list)
            return  <span style={{color:result.color}}>{result.name}</span>
        }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            const value = this.returnStatus(record).value;
            return <span>
              {this.getButton(value,record.id)}
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
              <Button onClick={() => {const { selectAllId } = this.state;this.showModal("add",selectAllId)}} style={{marginBottom: '5px',marginLeft:"15px"}}>发布</Button>
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
          onOk={this.changeAward}
          cancelText="取消"
          okText="确定"
          onCancel={()=>this.setState({visible:false})}
        >
          <div>
            <Form.Item
              label="手机号"
            >
              {getFieldDecorator('mobile', {
                initialValue:setPhone
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
