import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Form, Input, Switch, Radio, Select, Button, message, InputNumber, DatePicker, Checkbox, Table } from "antd";
import uuid from "uuid";
import moment from "moment";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { getRegular } from '../../components/CheckInput';

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

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
      classAwardList: [],
      boxList: [],
      boxOptionList: [],
      userDetails: [],
      selectedRowKeys: [],
      selectedRows: [],
      dataTable: [],
      isCheckClick: false
    };
    this.uuid = uuid.v1();
    this.reg = getRegular('mobile-phone')
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    this.getClassAward()
    
    if(id && id !== 'add') {
      this.getClassAppointRecords(id)
    }
    
    if(id && id == 'add') {
      this.getBoxes()
    }
  }

  componentWillReceiveProps(nextProps) {}

  getClassAppointRecords = (id) => {
    this.props.rts({
      url: `/classAppointRecords/${id}`,
      method: 'get',
    }, this.uuid, 'getVoucherAwards', (data) => {
      this.setState({
        drawSettingDetail: data,
      }, () => {
        this.getBoxes()
      })
    })
  }

  setBoxes = (data) => {
    let { boxOptionList } = this.state;
    let boxIds = data && data.boxIds || []
    return boxOptionList && boxOptionList.length > 0 && boxOptionList.filter(v => boxIds.includes(v.value) ? true : false) || []
    
  }

  getBoxes = () => {
    const { drawSettingDetail } = this.state
    this.props.rts({
      url: `/boxes`,
      method: 'get',
    }, this.uuid, 'getBoxes', (data) => {
      this.setState({
        boxList: data,
        boxOptionList: this.getClassOption(data),
      }, () => {
        if(drawSettingDetail && Object.keys(drawSettingDetail).length > 0) {
          this.setState({
            dataTable: drawSettingDetail && this.setBoxes(drawSettingDetail) || []
          })
        }
      })
    })
  }

  onSelection = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  getUser = (mobile = "") => {
    this.props.rts({
      url: `/accounts/getUser`,
      method: 'get',
      params:{
        filter: {
          where:{
            mobile,
          }
        }
      }
    }, this.uuid, 'getUser', (data) => {
      this.setState({
        userDetails: data,
        isCheckClick: true
      })
    })
  }

  getClassAward = () => {
    this.props.rts({
      url: `/classAwards`,
      method: 'get',
      params: {
        filter: {
          where: {
            enable: true
          }
        }
      }
    }, this.uuid, 'getClassAward', (data) => {
      this.setState({
        classAwardList: data,
        classOptionList: this.getClassOption(data),
      })
    })
  }

  getClassOption = (data) => {
    
    return data && Array.isArray(data) && data.map(v => {
      return {
        value: v.id,
        title: v.name
      }
    }) || []
  }

  putClassAppointRecords = (id, params) => {
    
    this.props.rts({
      url: id === 'add' ? '/classAppointRecords/createClassAppointRecord' : `/classAppointRecords/${id}`,
      method: id === 'add' ? `post`: 'patch',
      data: params
    }, this.uuid, 'putClassAppointRecords', () => {
      message.success('保存成功', 1, () => {
        this.props.goBack()
      })
    })
  }
 
  handleCancel = () => this.props.goBack()
  
  handleSubmit = (e) => {
    const { drawSettingDetail, dataTable, userDetails, isCheckClick } = this.state
    const { match } = this.props
    const { id } = match.params

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if(i === 'startTime') {
            params[i] = moment(values[i]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
            continue
          }
          if(i === 'endTime') {
            params[i] = moment(values[i]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
            continue
          }
          
          params[i] = values[i]
        }
        
        if(!moment(params['startTime']).isBefore(params['endTime'])) {
          message.error("生效时间不能超过过期时间", 1, () => {
            return 
          })
        }

        params['boxIds'] = dataTable && dataTable.length && dataTable.map(v => v.value) || []

        // if(userDetails && userDetails.length > 0 && userDetails[0].id) {
        //   params['userId'] = userDetails[0].id
        // }
        
        // if(drawSettingDetail && drawSettingDetail.id) params.id = drawSettingDetail.id
        // console.log(params, 167)
        // return
        if(isCheckClick)  {
          this.putClassAppointRecords(id, params)
        } else {
          message.info("请校验一下中奖人电话信息", 1)
        }
      }
    })
  }

  handleChange = (value) => {
    let { dataTable, boxOptionList} = this.state;
    
    if(!value) return

    const index = dataTable && dataTable.findIndex(v => v.value === value) >=0 ? dataTable.findIndex(v => v.value === value) : -1
    if(index < 0) {
      const boxs = boxOptionList && boxOptionList.length > 0 && boxOptionList.filter(v => v.value === value) || []
      dataTable = [...dataTable , ...boxs]
    } 
    this.setState({
      dataTable,
    })
  }

  handleDelete = () => {
    let { selectedRowKeys, dataTable } = this.state;
    
    dataTable = dataTable && dataTable.length > 0 && dataTable.filter(v => selectedRowKeys.includes(v.value) ? false : true) || []
    this.setState({
      dataTable,
    })
  }
  
  handleBlur = () => {
    console.log('blur');
  }
  
  handleFocus = () => {
    console.log('focus');
  }

  handleMobile = () => {
    const mobile = this.props.form.getFieldValue('mobile')
    if(mobile && this.reg.test(mobile)) {
      this.getUser(mobile)
    }
    // this.setState({
    //   isCheckClick: true
    // })
  }

  render() {
    
    const { getFieldDecorator } = this.props.form
    const { drawSettingDetail, classOptionList, boxList, boxOptionList, dataTable, userDetails, selectedRowKeys, selectedRows, isCheckClick } = this.state

    const startTime = moment().format()
    const endTime = moment().format()

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectedRowKeysChange,
      selections: true,
      onSelection: this.onSelection,
    };

    const columns = [{
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    }]

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

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
              <Button type="primary" onClick={() => {this.handleMobile()}}>校验</Button>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={8}></Col>
            {
              isCheckClick ?
                userDetails && userDetails.length > 0 ?
                <Col sm={14}>
                  <div style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                      <img style={{width: '100px', height: 'auto'}} src={userDetails && userDetails[0] && userDetails[0].avatar || ''} alt="img"/>
                    </div>
                    <div style={{flex: 4}}>
                      <div>微信昵称：{userDetails && userDetails[0] && userDetails[0].nickname || ''}</div>
                      <div>微信openID：{userDetails && userDetails[0] && userDetails[0].openid || ''}</div>
                    </div>
                  </div>
                </Col> :
                <div style={{color: 'red'}}>此电话还未关联任何用户</div>
              : null
            }
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
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      classOptionList && classOptionList.length > 0 ? classOptionList.map((v, i) => {
                        return <Option key={`option-${i}`} value={v.value}>{v.title}</Option>
                      }) : null
                    }
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
              >
                {getFieldDecorator(`probability`, {
                  rules: [
                    { message: '请输入中奖概率', required: true},
                  ],
                  initialValue: drawSettingDetail && drawSettingDetail.probability || 100
                })(
                  <InputNumber 
                    min={0.01} 
                    max={100} 
                    style={{ width: '100%'}}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                )}
              </FormItem>
            </Col>
            <Col sm={8}>
              <div style={{color: 'red'}}>最大可填数额为100，最小可填数额为0.01</div>
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
            <Col sm={11}>
              <FormItem 
                label={`过期时间`}
                {...formItemLayout}
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
            <Col sm={7}>
              <div style={{color: 'red'}}>生效时间必须大于领取时间小于过期时间</div>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={16}>
              <FormItem 
                label={`投放设备`}
                labelCol={{span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator(`boxIds`, {
                  rules: [{ message: '请选择投放设备', required: false}],
                  initialValue: drawSettingDetail && drawSettingDetail.boxIds || []
                })(
                  // <RadioGroup onChange={this.handleChange} value={this.state.value}>
                  //   <Radio style={radioStyle} value={1}>全部投放</Radio>
                  //   <Radio style={radioStyle} value={2}>随机投放</Radio>
                  // </RadioGroup>
                  <Select
                    showSearch
                    // style={{ width: 200 }}
                    placeholder="请选择投放设备"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      boxOptionList && boxOptionList.length > 0 ? boxOptionList.map((v, i) => {
                        return <Option key={`optionkey-${i}`} value={v.value}>{v.title}</Option>
                      }) : null
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={2}>
              <Button type="danger" size="small" onClick={()=>{this.handleDelete()}}>删除</Button>
            </Col>
          </Row>
          <Row gutter={24} style={{lineHeight: '35px'}}>
            <Col sm={8}></Col>
            {
              dataTable && dataTable.length > 0 ?
                <Col sm={8}>
                  <Table
                    bordered
                    rowKey="value"
                    size="small"
                    rowSelection={rowSelection}
                    showHeader={false}
                    pagination={false}
                    columns={columns}
                    locale={{
                      filterTitle: '筛选',
                      filterConfirm: '确定',
                      filterReset: '重置',
                      emptyText: '暂无数据'
                    }}
                    dataSource={dataTable ? dataTable : []} />
                </Col> :
              null
            }
          </Row>
          <div className="ta-c mt-20">
            <Button style={{marginRight: 10}} onClick={() => this.handleCancel()}>取消</Button>
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
