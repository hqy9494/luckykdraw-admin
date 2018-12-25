import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Form, Input, Switch, Select, Button, message, InputNumber, DatePicker } from "antd";
import uuid from "uuid";
import moment from "moment";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { getRegular } from '../../components/CheckInput';

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 18 },
  wrapperCol: { span: 6 },
};

export class DefineAwardSetting extends React.Component {
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
    this.reg = this.getRegular('mobile-phone')
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    
    if(id && id !== 'add') {
      this.getVoucherAwards(id)
    }
    
  }

  componentWillReceiveProps(nextProps) {}

  getVoucherAwards = (id) => {
    this.props.rts({
      url: `/VoucherAwards/${id}`,
      method: 'get',
    }, this.uuid, 'getVoucherAwards', (data) => {
      this.setState({
        drawSettingDetail: data,
        switchChecked: data && data.enable || false,
      })
    })
  }

  putVoucherAwards = (id, params) => {
    
    this.props.rts({
      url: id && id === 'add' ? `/VoucherAwards` : `/VoucherAwards/${id}`,
      method: id && id === 'add' ? `post` : 'patch',
      data: params
    }, this.uuid, 'putVoucherAwards', () => {
      message.success('保存成功', 1, () => {
        this.props.goBack()
      })
    })
  }
 
  handleCancel = () => this.props.goBack()
  
  handleSubmit = (e) => {
    const { drawSettingDetail } = this.state
    const { match } = this.props
    const { id } = match.params

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if(i === 'startTime' || i === 'endTime') {
            params[i] = moment(values[i]).format('YYYY-MM-DD HH:mm:ss')
            continue
          }
          if(i === 'highPrice' || i === 'lowPrice') {
            params[i] = values[i] * 100
            continue
          }
          
          if(i === 'duration' ) {
            params[i] = values[i] * 24
            continue
          }
          params[i] = values[i]
        }
        // if(drawSettingDetail && drawSettingDetail.id) params.id = drawSettingDetail.id

        if(params['lowPrice'] > params['highPrice']) {
          message.error('面额右值不行小于左值', 1)
        } else {
          id && this.putVoucherAwards(id, params)
        }
      }
    })
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  
  handleBlur = () => {
    console.log('blur');
  }
  
  handleFocus = () => {
    console.log('focus');
  }

  render() {
    
    const { getFieldDecorator } = this.props.form
    const { drawSettingDetail, switchChecked } = this.state

    const startTime = moment().format()
    const endTime = moment().format()

    return (
      <section className="DefineAwardSetting-page">
      	<Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
          <div className="project-title">中奖人信息</div>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem label={`中奖人电话`}
                {...formItemLayout}
              >
                {getFieldDecorator(`mobile`, {
                  rules: [
                    {message: '请输入中奖人电话', required: true},
                    {message: '请输入合法的手机格式', pattern: this.reg,}
                  ],
                  initialValue: drawSettingDetail && drawSettingDetail.mobile || ''
                })(
                  <Input placeholder="请输入中奖人电话"/>
                )}
              </FormItem>
            </Col>
            <Col sm={3}>
              <Button type="primary" onClick={() => {console.log(123)}}>校验</Button>
            </Col>
          </Row>
          <div className="project-title">奖品信息</div>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem label={`奖品`}
                {...formItemLayout}
              >
                {getFieldDecorator(`classAwardId`, {
                  rules: [{ message: '请选择奖品', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.classAwardId || ''
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择奖品"
                    optionFilterProp="children"
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="project-title">使用规则</div>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={11}>
              <FormItem 
                label={`中奖概率`}
                {...formItemLayout}
                extra={<div style={{color: 'red'}}>最大可填数额为100，最小可填数额为0</div>}
              >
                {getFieldDecorator(`probability`, {
                  rules: [{ message: '请输入中奖概率', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.probability || ''
                })(
                  <InputNumber min={0} max={100} style={{ width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col sm={1}>
              <div>%</div>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem 
                label={`生效时间`}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 7 }}
              >
                {getFieldDecorator(`startTime`, {
                  rules: [{ message: '请输入生效时间', required: true}],
                  initialValue: drawSettingDetail ? moment(drawSettingDetail.startTime) : moment(startTime)
                })(
                  <DatePicker
                    locale={locale}
                    dateRender={(current) => {
                      const style = {};
                      if (current.date() === 1) {
                        style.border = '1px solid #1890ff';
                        style.borderRadius = '50%';
                      }
                      return (
                        <div className="ant-calendar-date" style={style}>
                          {current.date()}
                        </div>
                      );
                    }}
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
                extra={<div style={{color: 'red'}}>生效时间必须大于领取时间小于过期时间</div>}
              >
                {getFieldDecorator(`endTime`, {
                  rules: [{ message: '请输入过期时间', required: true}],
                  initialValue: drawSettingDetail ? moment(drawSettingDetail.endTime) : moment(endTime)
                })(
                  <DatePicker
                    locale={locale}
                    dateRender={(current) => {
                      const style = {};
                      if (current.date() === 1) {
                        style.border = '1px solid #1890ff';
                        style.borderRadius = '50%';
                      }
                      return (
                        <div className="ant-calendar-date" style={style}>
                          {current.date()}
                        </div>
                      );
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={24}>
              <FormItem 
                label={`投放设备`}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 7 }}
              >
                {getFieldDecorator(`enable`, {
                  rules: [{ message: '', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.enable || false
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择奖品"
                    optionFilterProp="children"
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={3}>
              <Button type="danger" size="small">删除</Button>
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

const DefineAwardSettingForm = Form.create()(DefineAwardSetting)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDrawSettings
});

export default connect(mapStateToProps, mapDispatchToProps)(DefineAwardSettingForm);
