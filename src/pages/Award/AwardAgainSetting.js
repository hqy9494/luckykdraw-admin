import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Form, Input, Switch, Select, Button, message, InputNumber, DatePicker } from "antd";
import uuid from "uuid";
import moment from "moment";
import locale from 'antd/lib/date-picker/locale/zh_CN';

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 18 },
  wrapperCol: { span: 6 },
};

export class AwardAgainSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      previewVisible: false,
      imageFixWidthUrl: [],
      imageUrl: [],
      prizeType: null,
      showType: false,
      optionType: null,
      drawSettingDetail: {},
      switchChecked: false,
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    this.getVoucherAwards()
  }

  componentWillReceiveProps(nextProps) {
    
  }

  getVoucherAwards = () => {
    this.props.rts({
      url: `/VoucherAwards`,
      method: 'get',
    }, this.uuid, 'getVoucherAwards', (data) => {
      this.setState({
        drawSettingDetail: data[0],
      })
    })
  }

  putVoucherAwards = params => {
    this.props.rts({
      url: `/VoucherAwards`,
      method: 'put',
      data: params
    }, this.uuid, 'putDrawSettings', () => {
      message.success('保存成功', 2)
    })
  }
 
  // handleCancel = () => this.props.to(`/Activity/AwardAgainSetting`)
  
  handleSubmit = (e) => {
    const { drawSettingDetail } = this.state
    
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          else params.config[i] = values[i]
        }
        if(drawSettingDetail && drawSettingDetail.id) params.id = drawSettingDetail.id

        if(params.config['randomLeft'] > params.config['randomRight']) {
          message.error('随机奖励水晶范围右值不行小于左值', 1)
        } else if(params.config['supportLeft'] > params.config['supportRight']) {
          message.error('点赞奖励水晶范围右值不行小于左值', 1)
        } else {
          drawSettingDetail && drawSettingDetail.id && this.putVoucherAwards(params)
        }
      }
    })
  }
  render() {
    
    const { getFieldDecorator } = this.props.form
    const { drawSettingDetail, switchChecked } = this.state
    
    return (
      <section className="AwardAgainSetting-page">
      	<Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
          <div className="project-title">优惠码基础信息</div>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem label={`优惠码名称`}
                {...formItemLayout}
              >
                {getFieldDecorator(`name`, {
                  rules: [{ message: '请输入优惠码名称', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.name || ''
                })(
                  <Input placeholder="请输入优惠码名称"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem label={`面额(元)`}
                {...formItemLayout}
              >
                {getFieldDecorator(`lowPrice`, {
                  rules: [{ message: '请输入面额', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.lowPrice || ''
                })(
                  <InputNumber min={1} style={{ width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col sm={1}>
              <div>至</div>
            </Col>
            <Col sm={10}>
              <FormItem wrapperCol={{ span: 6 }}>
                {getFieldDecorator(`highPrice`, {
                  rules: [{message: '请输入面额范围', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.highPrice || 0
                })(
                  <InputNumber min={1} style={{ width: '100%'}}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="project-title">使用规则</div>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem 
                label={`生效时间`}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 7 }}
              >
                {getFieldDecorator(`startTime`, {
                  rules: [{ message: '', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.enable || false
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={locale}
                    // disabledDate={disabledDate}
                    // disabledTime={disabledDateTime}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem 
                label={`过期时间`}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 7 }}
                extra={"生效时间必须大于领取时间小于过期时间"}
              >
                {getFieldDecorator(`endTime`, {
                  rules: [{ message: '', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.endTime || false
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    locale={locale}
                    // disabledDate={disabledDate}
                    // disabledTime={disabledDateTime}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem label={`领取优惠券后`}
                {...formItemLayout}
              >
                {getFieldDecorator(`duration`, {
                  rules: [{ message: '请输入优惠券有效时间', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.duration || ''
                })(
                  <InputNumber min={1} style={{ width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col sm={3}>
              <div>天内有效</div>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem 
                label={`功能开启`}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 7 }}
              >
                {getFieldDecorator(`enable`, {
                  rules: [{ message: '', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.enable || false
                })(
                  <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭" 
                    checked={switchChecked || false}
                    onChange={(v)=>{ this.setState({ switchChecked: v }) }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="ta-c mt-20">
            <Button style={{marginRight: 10}} onClick={this.handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </div>
        </Form>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid")
const getDrawSettings = state => state.get("rts").get("getDrawSettings")

const AwardAgainSettingForm = Form.create()(AwardAgainSetting)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDrawSettings
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardAgainSettingForm);
