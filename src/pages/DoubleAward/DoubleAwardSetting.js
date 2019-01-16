import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {  Panel } from 'react-bootstrap';
import uuid from "uuid";
import { Col, Row, Form, Input, Switch, Select, Button, message, InputNumber } from "antd";

// import "./DefineAwardSetting.scss";
const FormItem = Form.Item
const Option = Select.Option

const reg = /^([1-9][0-9]{0,1}|100)$/;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
export class DoubleAwardSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classId: null,
      classPercen: 0,
      classProportion: 1,
      classEnable: false,
      normalId: null,
      normalPercen: 0,
      normalProportion: 1,
      normalEnable: false,
    };
    this.uuid = uuid.v1();
  }
  componentWillMount(){
  }

  componentDidMount() {
    this.getNormal();
    this.getClass();
  }
  
  getNormal = () => {
    this.props.rts(
      {
        method: 'get',
        url: '/DoubleAwardSettings',
        params: {filter: {where: {type: "normal"}}}
      },
      this.uuid,
      'DoubleAwardNormal',
      (res = []) => {
          if(res[0]) {
            this.setState({
              normalId: res[0].id,
              normalEnable: res[0].enable,
              normalProportion: res[0].proportion,
              normalPercen: parseInt(100/(1+res[0].proportion)),
            })
          }
      });
  }
  getClass = () => {
    this.props.rts(
      {
        method: 'get',
        url: '/DoubleAwardSettings',
        params: {filter: {where: {type: "class"}}} 
      },
      this.uuid,
      'DoubleAwardClass',
      (res = []) => {
        if(res[0]) {
          this.setState({
            classId: res[0].id,
            classEnable: res[0].enable,
            classProportion: res[0].proportion,
            classPercen: parseInt(100/(1+res[0].proportion)),
          })
        }
      });
  }
  // handleChange = () => {
  //   this.props.form.validateFields((err, values) => {
  //     if(!err){
  //       values.enable = !!values.enable;
  //       this.props.rts(
  //         {
  //           method: 'post',
  //           url: "/systems/switchAddPredict",
  //           params: values
  //         },
  //         this.uuid,
  //         'searchData',
  //         (res = {}) => {
  //           message.success("修改成功！");
  //         });
  //     }
  //   });
  // }

  handlePercenChange = (e,type) => {
    
    let proportion = (100/e).toFixed(2);
    console.log('pp',proportion)
    if(type === "class"){
      this.setState({
        classPercen: e,
        classProportion: proportion,
      })
    }else{
      this.setState({
        normalPercen: e,
        normalProportion: proportion,
      })
    }
    
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if(reg.test(this.state.classPercen)) {
      let classParams = {
        id: this.state.classId,
        type: "class",
        enable: this.state.classEnable,
        proportion: this.state.classProportion,
      }
       this.props.rts(
        {
          method: this.state.classId? 'put':'post',
          url: '/DoubleAwardSettings',
          data: classParams
        },
        this.uuid,
        'setClass',
        (res = {}) => {
          message.success("等级奖设置成功！",1);
        }
      )
    }
    else{
      message.error("等级奖设置失败！",1)
    } 
    
    if(reg.test(this.state.normalPercen)){
      let normalParams = {
        id: this.state.normalId,
        type: "normal",
        enable: this.state.normalEnable,
        proportion: this.state.normalProportion,
      }
     
      this.props.rts(
        {
          method: this.state.normalId?'put':'post',
          url: '/DoubleAwardSettings',
          data: normalParams
        },
        this.uuid,
        'setNormal',
        (res = {}) => {
          message.success("轮次奖设置成功！",1);
        }
      )
    } 
    else{
      message.error("轮次奖设置失败！",1)
    } 
    
  } 


  render() {
    const { normalEnable,normalPercen,normalProportion,classEnable,classPercen,classProportion } = this.state;
    console.log( normalEnable,normalPercen,normalProportion,classEnable,classPercen,classProportion )

    const { getFieldDecorator } = this.props.form;
    return (
      <section className="DefineAwardSetting">
        <Panel>
          <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
            <Row gutter={24} style={{lineHeight: '35px'}}>
              <Col sm={24}>
                <FormItem
                  label={`等级奖是否开启翻倍奖励`}
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  {getFieldDecorator(`enable`, {
                    rules: [{ message: '', required: true}],
                    initialValue: classEnable || false
                  })(
                    <Switch
                      checkedChildren="开启"
                      unCheckedChildren="关闭"
                      checked={this.state.classEnable || false}
                      onChange={(v)=>{ this.setState({classEnable: v }) }}
                    />
                   )} 
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{lineHeight: '35px'}}>
              
              <Col sm={24}>
                <FormItem label={`等级红包分成策略: `}
                  {...formItemLayout}
                >
                <div style={{float:'left'}}>中奖获得总奖金</div>
                  {getFieldDecorator(`classPercen`, {
                    rules: [{ message: '输入百分比数值格式错误', required: true,pattern: reg}],
                    initialValue: this.state.classPercen || 0
                  })( 
                    <InputNumber min={1} max={100} style={{display:'block',float:'left',margin: '0 10px '}} onChange={e => {this.handlePercenChange(e,"class")}}/>
                 )}
                  <div style={{float:'left'}}>%，分享后获得总奖金 <strong style={{color: 'red',fontWeight: 'bold',fontSize: '20px'}}>{reg.test(classPercen)?(100-classPercen)+"%":"--"}</strong></div>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem
                label={`轮次奖是否开启翻倍奖励`}
                labelCol={{ span: 7}}
                wrapperCol={{ span: 17 }}
              >
                {getFieldDecorator(`normalEnable`, {
                  rules: [{ message: '', required: true}],
                  initialValue: normalEnable || false
                })(
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                    checked={normalEnable || false}
                    onChange={(v)=>{ this.setState({ normalEnable: v }) }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            
            <Col sm={24}>
              <FormItem label={`轮次红包分成策略: `}
                {...formItemLayout}
              >
              <div style={{float:'left'}}>中奖获得总奖金</div>
                {getFieldDecorator(`normalPercen`, {
                  rules: [{ message: "输入百分比数值格式错误", required: true,pattern: reg}],
                  initialValue: normalPercen || 0
                })(
                  <InputNumber min={1} max={100} style={{display:'block',float:'left',margin: '0 10px '}} onChange={e => {this.handlePercenChange(e,"normal")}}/>
                 )}
                <div style={{float:'left'}}>%，分享后获得总奖金 <strong style={{color: 'red',fontWeight: 'bold',fontSize: '20px'}}>{reg.test(normalPercen)?(100-normalPercen)+"%":"--"}</strong></div>
              </FormItem>
            </Col>
          
          </Row>
          
          
            <div className="ta-c mt-20">
              <Button style={{marginRight: 10}} onClick={()=>window.rel}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </div>
          </Form>
        </Panel>

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
const DoubleAwardSettingForm = Form.create()(DoubleAwardSetting);
export default connect(mapStateToProps, mapDispatchToProps)(DoubleAwardSettingForm);
