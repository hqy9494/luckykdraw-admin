import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, InputNumber, message, Radio, Select, Button, Cascader, Upload, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import configDevUrl from '../../config/dev'
import configProdUrl from "../../config/prod"

const configURL =  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? configProdUrl : configDevUrl

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
};

export class AwardListSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      previewVisible: false,
      imageFixWidthUrl: [],
      picture: [],
      prizeType: null,
      showType: false,
      optionType: null,
      defaultDetail: {},
      defaultList: [],
      levelsList: [],
      typeList: [],
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    if(id && id !== 'add') {
      this.getClassAwards(id)
    }

    this.getAwardTypes()
    this.getClassLevels()
  }
  componentWillReceiveProps(nextProps) {
    
  }


  putClassAwards = (id, params) => {
    this.props.rts({
      url: id && id === 'add' ? `/classAwards` : `/classAwards/${id}`,
      method: id && id === 'add' ? `post` : 'patch',
      data: params
    }, this.uuid, 'putClassAwards', () => {
      message.success('保存成功', 1, () => {
        this.props.goBack()
      })
    })
  }

  getClassAwards = (id) => {
    this.props.rts({
      method: 'get',
      url: `/classAwards/${id}`
    }, this.uuid, 'getClassAwards', (data) => {
      this.setState({
        defaultDetail: data,
        optionType: data && data.type || null
      })
      this.handleChange('picture', {
        fileList: [{
          uid: -1,
          name: '1.png',
          status: 'done',
          url: data['picture'],
          thumbUrl: data['picture']
        }]
      })
    })
  }

  getAwardTypes = () => {
    this.props.rts({
      method: "get",
      url: "/classAwards/getAwardTypes"
    },this.uuid, "getAwardTypes", (v) => {
      this.setState({
        typeList: v
      })
    });
  };

  getClassLevels = () => {
    this.props.rts({
      method: "get",
      url: "/ClassLevels"
    },this.uuid, "getClassLevels", (v) => {
      this.setState({
        levelsList: v
      })
    });
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
        this.handleChange('picture', {
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

  removeChange = (name, value) => {
    this.props.form.setFieldsValue({[name]: []})
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

  onClassSelectChange = (val) => {}

  handleSubmit = (e) => {
    e.preventDefault();

    let newParams = [];
    const { match } = this.props
    const { id } = match.params

    const { optionType } = this.state

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
      
        for(let i of Object.keys(values)){
          if (values[i] == null) continue

          if (i === 'price' || i === 'cost') {
            params[i] = Number(values[i])
            continue
          }

          if (i === 'picture') {
            if (values[i]['file'] && values[i]['file']['status']) {
              params[i] = values[i]['file']['response'] && values[i]['file']['response'].url
            }else{
              params[i] = values[i][0]['url']
            }
            continue
          }
          params[i] = values[i]
        }
        
        if(optionType !== 'RED_PACKET' && this.props.form.getFieldValue('picture').file && 
          this.props.form.getFieldValue('picture').file.status === 'removed') {
            
            message.info('图片不能为空', 1 , () => {
              return
            })
        }
        this.putClassAwards(id, params)
      }
    })
  }
  render() {

    const { getFieldDecorator } = this.props.form
    const { optionType, prizeType, typeList, defaultDetail, levelsList } = this.state

    const uploadButton = (<div> <Icon type="upload" /> 添加 </div>)
    
    return (
      <section className="AwardListSetting-page EquipmentInfoDetail-page">
       	<Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品名称`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`name`, {
                    rules: [{ required: true, message: '请输入奖品名称' }],
                    initialValue: defaultDetail && defaultDetail.name || ''
                  })(
                    <Input placeholder="请输入奖品名称"/>
                  )}
                </FormItem>
              </Col>
            </Row>
           
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`奖品类型`}
                    {...formItemLayout}
                  >
                    {getFieldDecorator(`type`, {
                      rules: [{message: '请选择奖品类型', required: true}],
                      initialValue: defaultDetail && defaultDetail.type || ''
                    })(
                      <Select placeholder="请选择" onChange={this.onSelectChange} locale={zh_CN}>
                        {
                          typeList &&
                          typeList.length ?
                          typeList.map((v, i) => {
                            return (
                              <Option value={v.type} key={i}>{v.name}</Option>
                            )
                          }) :
                          null
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            {optionType && optionType !== 'RED_PACKET' ?
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem
                    label={`奖品图片`}
                    {...formItemLayout}
                  >
                    {getFieldDecorator(`picture`, {
                      rules: [{message: '请上传图片', required: true}],
                      initialValue: this.state.picture || []
                    })(
                      <Upload
                        name="file"
                        action={`${configURL.apiUrl}${configURL.apiBasePath}/files/upload`}
                        listType="picture-card"
                        headers={{
                          Authorization: localStorage.token
                        }}
                        onPreview={this.handlePreview}
                        onChange={(fileList) => {
                          this.handleChange('picture', fileList)
                        }}
                        onRemove={(fileList) => {
                          this.removeChange('picture', fileList)
                        }}
                        accept="image/*"
                        fileList={this.state.picture || []}
                      >
                        {this.state.picture.length === 1 ? null : uploadButton}
                      </Upload>
                    )}
                  </FormItem>
                </Col>
              </Row>: null
            }
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品级别`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`classLevelId`, {
                    rules: [{message: '请选择奖品级别', required: true}],
                    initialValue: defaultDetail && defaultDetail.classLevelId || ''
                  })(
                    <Select placeholder="请选择" onChange={this.onClassSelectChange} locale={zh_CN}>
                      {
                        levelsList &&
                        levelsList.length ?
                        levelsList.map((v, i) => {
                          return (
                            <Option value={v.id} key={i}>{v.name}</Option>
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
                  {getFieldDecorator(`price`, {
                    rules: [{message: '请输入奖品价格', required: true}],
                    initialValue: defaultDetail && defaultDetail.price || 0
                  })(
                    <InputNumber style={{width: '100%'}} min={0} placeholder="请输入奖品价格" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品成本`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`cost`, {
                    rules: [{ message: '请输入奖品成本', required: true}],
                    initialValue: defaultDetail && defaultDetail.cost || 0
                  })(
                    <InputNumber style={{width: '100%'}} min={0} placeholder="请输入奖品成本" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`奖品单位`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`unit`, {
                    rules: [{ message: '请输入奖品单位', required: true}],
                    initialValue: defaultDetail && defaultDetail.unit || ''
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
const getAwardTypes = state => state.get("rts").get("getAwardTypes")
const getClassLevels = state => state.get("rts").get("getClassLevels")


const AwardListSettingForm = Form.create()(AwardListSetting)

const mapStateToProps = createStructuredSelector({
  UUid,
  getProduct,
  getAwardTypes,
  getClassLevels,
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardListSettingForm);
