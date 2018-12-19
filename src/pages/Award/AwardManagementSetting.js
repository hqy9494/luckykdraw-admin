import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Divider, Form, Input, Checkbox, Radio, Select, Button, Switch, Upload, Modal, message, InputNumber } from "antd";
import moment from "moment";
import uuid from "uuid";
import config from "../../config"
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import DetailTemplate from "../../components/DetailTemplate";

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

export class AwardManageSetting extends React.Component {
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
      drawSettingDetail: {}
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    if(id && id !== 'add') {
      this.getClassLevels(id)
    }
 
  }

  componentWillReceiveProps(nextProps) {}

  getClassLevels = (id) => {
    this.props.rts({
      method: 'get',
      url: `/ClassLevels/${id}`
    }, this.uuid, 'getClassLevels', (data) => {
      this.setState({
        drawSettingDetail: data
      })
    })
  }

  putClassLevels = (id, params) => {
    this.props.rts({
      url: id && id === 'add' ? `/ClassLevels` : `/ClassLevels/${id}`,
      method: id && id === 'add' ? `post` : 'put',
      data: params
    }, this.uuid, 'putClassLevels', () => {
      message.success('保存成功', 1, () => {
        this.props.goBack()
      })
    })
  }
  handleCancel = () => this.setState({ previewVisible: false })
  
  handleSubmit = (e) => {
    const { match } = this.props
    const id = match.params.id 

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          params[i] = values[i]
        }
        // console.log(params, 85)
        if(!id) return
        this.putClassLevels(id, params)
      }
    })
  }
  render() {
    
    const { getFieldDecorator } = this.props.form
    const { product, prizeType, optionType, drawSettingDetail, switchChecked } = this.state
    const typeList = [{
      type: 'SUBTITLE', 
      name: '弹幕'
    },{
      type: 'BANNER', 
      name: 'Banner爆屏'
    },{
      type: 'ALL', 
      name: '全屏爆屏'
    }]
    return (
      <section className="AwardManageSetting-page EquipmentInfoDetail-page">
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem label={`奖品级别`}
                {...formItemLayout}
              >
                {getFieldDecorator(`name`, {
                  rules: [{ required: true, message: '请输入奖品级别' }],
                  initialValue: drawSettingDetail && drawSettingDetail.name || ''
                })(
                  <Input placeholder="请设置奖品级别"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem label={`中奖机制`}
                {...formItemLayout}
              >
                {getFieldDecorator(`base`, {
                  rules: [{message: '请输入中奖基数', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.base || 0
                })(
                  <InputNumber style={{width: '100%'}} min={1} placeholder="请设置奖品排序"/>
                )}
              </FormItem>
            </Col>
            <Col sm={3}>
              <div>盒/轮</div>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem label={`奖品数量`}
                {...formItemLayout}
              >
                {getFieldDecorator(`dividend`, {
                  rules: [{message: '请输入奖品数量', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.dividend || 0
                })(
                  <InputNumber style={{width: '100%'}} min={1} placeholder="请设置奖品排序"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem label={`排序设置`}
                {...formItemLayout}
              >
                {getFieldDecorator(`order`, {
                  rules: [{ message: '请输入奖品排序', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.order || 0
                })(
                  <InputNumber style={{width: '100%'}} min={0} placeholder="请设置奖品排序"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem label={`开启/禁用`}
                {...formItemLayout}
              >
                {getFieldDecorator(`enable`, {
                  rules: [{ message: '', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.enable || false
                })(
                  <Switch
                    checkedChildren="开启"
                    unCheckedChildren="禁用"
                    checked={switchChecked || false}
                    onChange={(v)=>{ this.setState({ switchChecked: v }) }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={12}>
              <FormItem 
                label={`爆屏设置`}
                {...formItemLayout}
              >
                {getFieldDecorator(`bpStatus`, {
                  rules: [{ message: '请选择弹幕类型', required: true}],
                  initialValue: drawSettingDetail && drawSettingDetail.bpStatus || ''
                })(
                  <Checkbox.Group>
                    {
                      typeList &&
                      typeList.length ?
                      typeList.map((v, i) => {
                        return (
                          <Checkbox value={v.type} key={i}>{v.name}</Checkbox>
                        )
                      }) :
                      null
                    }
                  </Checkbox.Group>
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="ta-c mt-20">
            <Button onClick={() => this.props.goBack()}>返回</Button>
              <Divider type="vertical" />
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

const AwardManageSettingForm = Form.create()(AwardManageSetting)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDrawSettings
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardManageSettingForm);
