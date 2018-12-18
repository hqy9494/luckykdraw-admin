import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, InputNumber, DatePicker, Radio, Select, Button, Cascader, Upload, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";
import configURL from "../../config/dev"
import zh_CN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
};

export class WinningSetting extends React.Component {
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
      defaultDetail: {},
      defaultList: []
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    id && this.getDrawSetting(id)

    this.getOptions()
  }
  componentWillReceiveProps(nextProps) {}

  getDrawSetting = (index) => {
    this.props.rts({
      method: 'get',
      url: `/drawSettings`
    }, this.uuid, 'getDrawSetting', (data) => {
      if (index && index !== 'add') {

        data && this.modifyDrawDetail(data, index, 'defaultList')

      } else if (index && index === 'add') {
        this.setState({
          defaultList: data['defaultList'] ? data['defaultList'] : []
        })
      }
    })
  }

  modifyDrawDetail = (data = {}, index = 0, propsType) => {
    if(data[propsType]) {
      this.setState({
        [propsType]: data[propsType],
        defaultDetail: data[propsType].length ? data[propsType][index] : [],
        defaultIndex: index
      })
      if(data[propsType].length) {
        this.onSelectChange(data[propsType][index]['type'])
        this.handleChange('imageUrl', {
          fileList: [{
            uid: -1,
            name: '1.png',
            status: 'done',
            url: data[propsType][index]['picture'],
            thumbUrl: data[propsType][index]['picture']
          }]
        })
      }
    }
  }

  getOptions = () => {
    const optionList = [
      { name: "优惠券", value: "COUPON"},
      { name: "读书卡", value: "BOOK_CARD"},
      { name: "红包", value: "RED_PACKET"},
      { name: "实物", value: "METARIAL"}
    ]
    this.setState({ prizeType: optionList })
  }
  postUpdatePrize = params => {  // ** 添加奖品
    this.props.rts({
      url: '/drawSettings/updatePrizeContent',
      method: 'put',
      data: params
    }, this.uuid, 'postUpdatePrize', () => {
      this.props.goBack()
    })
  }
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  handleChange = (name, { fileList }) => this.setState({ [name]: fileList })

  onSelectChange = (val) => this.setState({ optionType: val })

  handleSubmit = (e) => {
    e.preventDefault();
    const { optionType, defaultList, defaultIndex } = this.state
    let newParams = [];
    const { match } = this.props
    const { id } = match.params

    const typeList = ['stock', 'value', 'count', 'cost']
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue

          if (i === 'stock' || i === 'value' || i === 'count' || i === 'cost') {
            params[i] = Number(values[i])
            continue
          }

          if (i === 'picture') {
            if (values[i]['file']) {
              params[i] = values[i]['file'] && values[i]['file']['response'] && values[i]['file']['response'].src
            }else{
              params[i] = values[i][0]['url']
            }
            continue
          }
          params[i] = values[i]
        }
        for(let v of typeList.values()) {
          if(!(v in params)) {
            params[v] = 0
            continue
          }
        }
        if(id && id !== 'add') {
          newParams = defaultList && defaultList.length && defaultList.map((v,i) => {
            if(i === Number(defaultIndex)) {
              return {
                ...params,
              }
            } else {
              return v
            }
          })
        } else if(id && id === 'add') {
          newParams = [...defaultList, ...[params]]
        }
        newParams.length && this.postUpdatePrize(newParams)
      }
    })
  }
  render() {

    const { getFieldDecorator } = this.props.form
    const { product, prizeType, optionType, defaultDetail } = this.state

    const uploadButton = (<div> <Icon type="upload" /> 添加 </div>)
    
    return (
      <section className="WinningSetting-page EquipmentInfoDetail-page">
       	<Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品名称`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`type`, {
                    rules: [{ required: true, message: '请输入奖品名称' }],
                    initialValue: defaultDetail && defaultDetail.type || ''
                  })(
                    <Input placeholder="请输入奖品名称"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem
                  label={`奖品图片`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`picture`, {
                    rules: [{message: '请上传图片', required: true}],
                    initialValue: this.state.imageUrl || []
                  })(
                    <Upload
                      name="file"
                      action={`${configURL.apiUrl}${configURL.apiBasePath}/ShopPictures/${'default'}/upload`}
                      listType="picture-card"
                      headers={{
                        Authorization: localStorage.token
                      }}
                      onPreview={this.handlePreview}
                      onChange={(fileList) => {
                        this.handleChange('imageUrl', fileList)
                      }}
                      accept="image/*"
                      fileList={this.state.imageUrl || []}
                    >
                      {this.state.imageUrl.length === 1 ? null : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品级别`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`cost`, {
                    rules: [{message: '请选择奖品级别', required: true}],
                    initialValue: defaultDetail && defaultDetail.cost || ''
                  })(
                    <Select placeholder="请选择" onChange={this.onSelectChange} locale={zh_CN}>
                      {
                        prizeType &&
                        prizeType.length ?
                        prizeType.map((v, i) => {
                          return (
                            <Option value={v.value} key={i}>{v.name}</Option>
                          )
                        }) :
                        null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品价格`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`name`, {
                    rules: [{message: '请输入奖品价格', required: true}],
                    initialValue: defaultDetail && defaultDetail.name || ''
                  })(
                    <Input placeholder="请输入奖品价格"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品成本`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`value`, {
                    rules: [{ message: '请输入奖品成本', required: true}],
                    initialValue: defaultDetail && defaultDetail.value || ''
                  })(
                    <InputNumber style={{width: '100%'}} min={0} placeholder="请输入奖品成本" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品类型`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`cost`, {
                    rules: [{message: '请选择奖品类型', required: true}],
                    initialValue: defaultDetail && defaultDetail.cost || ''
                  })(
                    <Select placeholder="请选择" onChange={this.onSelectChange} locale={zh_CN}>
                      {
                        prizeType &&
                        prizeType.length ?
                        prizeType.map((v, i) => {
                          return (
                            <Option value={v.value} key={i}>{v.name}</Option>
                          )
                        }) :
                        null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品单位`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`count`, {
                    rules: [{ message: '请输入奖品单位', required: true}],
                    initialValue: defaultDetail && defaultDetail.count || ''
                  })(
                    <Input placeholder="请输入奖品单位"/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div className="ta-c mt-20">
              <Button style={{ marginRight: 8 }} onClick={() => {
                this.props.goBack()
              }}>
                返回
              </Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid")
const getProduct = state => state.get("rts").get("getProduct")

const WinningSettingForm = Form.create()(WinningSetting)

const mapStateToProps = createStructuredSelector({
  UUid,
  getProduct
});

export default connect(mapStateToProps, mapDispatchToProps)(WinningSettingForm);
