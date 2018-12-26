import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {  Panel } from 'react-bootstrap';
import uuid from "uuid";
import { Form ,Radio , Button,message} from "antd";
import "./DefineAwardSetting.scss";
export class DefineAwardSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enable:undefined
    };
    this.uuid = uuid.v1();
  }
  componentWillMount(){
    this.getSelect();
  }
  getSelect = () => {
    this.props.rts(
      {
        method: 'get',
        url: "/systems/getAddPredict"
      },
      this.uuid,
      'searchData',
      (res = {}) => {
        this.setState({enable:res.value==="true"?1:0});
      });
  }
  handleChange = () => {
    this.props.form.validateFields((err, values) => {
      if(!err){
        values.enable = !!values.enable;
        this.props.rts(
          {
            method: 'post',
            url: "/systems/switchAddPredict",
            params: values
          },
          this.uuid,
          'searchData',
          (res = {}) => {
            message.success("修改成功！");
          });
      }
    });
  }
  render() {
    const { enable } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <section className="DefineAwardSetting">
        <Panel>
            <Form.Item
              label=""
            >
              {getFieldDecorator('enable', {
                rules: [{
                  required: true, message: '请选择!'
                }],
                initialValue:enable
              })(
                <Radio.Group>
                  <Radio value={0}>撤销奖池后不影响当天预估奖池</Radio>
                  <br/>
                  <Radio value={1}>撤销奖池后影响当天预估奖池，预计奖池做对应数量扣减</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <div style={{textAlign:"center"}}>
              <Button type="primary" 
                onClick={this.handleChange}
              >确定</Button>
            </div>
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
const WrappeDefineAwardSetting = Form.create()(DefineAwardSetting);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeDefineAwardSetting);
