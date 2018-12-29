import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import moment from "moment";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import { Modal, Divider,Button, Form, Input, Select, message, Steps, DatePicker } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import configDevUrl from '../../config/dev'
import configProdUrl from "../../config/prod"
import { getUrlParams } from "../../utils/utils"
import locale from 'antd/lib/date-picker/locale/zh_CN';

const FormItem = Form.Item
const Option = Select.Option
const Step = Steps.Step
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

const configUrl =  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? configProdUrl : configDevUrl

export class WinningList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      isOrderEdit: false,
      getData:{},
      optionLevels: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getLevels()
  }

  componentWillReceiveProps(nextProps) {
    const { getLogisticsDetail } = nextProps;
    if (getLogisticsDetail && getLogisticsDetail[this.uuid]) {
      this.setState({
        getData: getLogisticsDetail[this.uuid].awardLogistics,
      })
    }
  }

  getOneClassLevels = (id) => {
    let {levelList} = this.state

    if(!id) return ''
    if(!Array.isArray(levelList)) return ''

    levelList = levelList.filter(v => v.id === id)

    return levelList[0].name
  }

  getLevels = () => {
    this.props.rts({
      method: "get",
      url: "/ClassLevels"
    },this.uuid, "getLevels", (v) => {
      this.setState({
        levelList: v
      })
      this.optionLevels(v)
    });
  }

  optionLevels = (option) => {
    let optionLevels = option && Array.isArray(option) && option.map(v => {
      return {
        title: v.name || '',
        value: v.name || ''
      }
    }) || []
    this.setState({
      optionLevels
    })
  }

  searchsToWhere = (search = {}) => {
    let where = {};

    if(!Object.keys(search).length) return where

    where = search.s && search.s.reduce((a, c) => {
      if(c.v && c.v.constructor === Array) {
        if (c.v[0] && c.v[1]) {
          a[c.f] = { between: [c.v[0], c.v[1]] };
        } else if (c.v[0]) {
          a[c.f] = { gt: c.v[0] };
        } else if (c.v[1]) {
          a[c.f] = { lt: c.v[1] };
        }
      } else {
        a[c.f] = c.v;
      }
      return a
    },{})

    where = Object.assign({}, {where: where}, {skip: search.skip})
  
    return where;
  };

  // 获取物流信息
  getLogisticsDetail = (id) => {
    console.log(id, 115)
    this.props.rts({
        method: "get",
        url: `/awardrecords/${id}/logistics`,
      }, this.uuid, "getLogisticsDetail")
  };

  isShowDeliver = ( record = {}) => {
    if(record.fahuoed) {
      this.getLogisticsDetail(record.id)
      this.setState({
        show: true,
        isOrderEdit: true,
        orderRecord: record,
        curRow: record,
      })
    } else {
      this.setState({
        show: true,
        isOrderEdit: true,
        orderRecord: record,
        curRow: record,
      })
    }
  }

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.classAwardRecord && this.state.curRow.classAwardRecord.awardRecordId) {
      this.props.rts({
        method: "post",
        url: `/awardrecords/${this.state.curRow.classAwardRecord.awardRecordId}/fahuo`,
        data: values
      }, this.uuid, "submitNew", () => {
          this.setState({refreshTable: true, visible: false});
        }
      );
      message.success('发货成功', 1, () => {
        this.setState({refreshTable: true, visible: false});
      })
      // setTimeout(() => {
      //   this.setState({refreshTable: true, visible: false});
      // }, 2001)
    }
  };

  handleExcel = (type) => {
    this.setState({
      outputVisible: false,
    }, () => {
      if(type === 'success') {
        message.success('导出成功', 1, () => {
          this.props.form.resetFields(['award','time'])
        })
      } else {
        this.props.form.resetFields(['award','time'])
      }
    })
  }

  deliverCheck = (orderId) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)) {
          if(values[i] == null) continue

          if(i === 'deliverExpressNo') {
            params['no'] = values[i]
            continue
          }
          if(i === 'deliverCompany') {
            params['company'] = values[i]
            continue
          }
        }
        if(!orderId) return;
        this.putLogistics(orderId, params)
      }
      // this.props.form.resetFields()
    });
  };

  render() {
    const that = this
    const {orderRecord, getData, optionLevels} = this.state
    const {getFieldDecorator, getFieldValue} = this.props.form;
    
    console.log(getData, 201)

    const { isEdit, isOrderEdit } = this.state;

    const urlParams =  getUrlParams()
    
    let deliverMsg = [
      { value: 'ems', name: 'EMS快递'},
      { value: 'shunfeng', name: '顺丰快递'},
      { value: 'yuantong', name: '圆通快递'},
      { value: 'zhongtong', name: '中通快递'},
      { value: 'yunda', name: '韵达快递'}
    ]
    
    const where = urlParams && urlParams.q && this.searchsToWhere(JSON.parse(decodeURIComponent(urlParams.q))) || {}
    const filter = Object.assign({}, {...where}, { order: "createdAt DESC" })

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/classAwardRecords/getAwardRecords",
        total: "/classAwardRecords/getCount",
      },
      buttons: [],
      // search: [{
      //   type: "field",
      //   field: "user.nickname",
      //   title: "用户昵称"
      // },{
      //   type: "number",
      //   field: "value",
      //   title: "用户姓名"
      // },{
      //   type: "option",
      //   field: "value",
      //   title: "联系方式",
      // },{
      //   type: "number",
      //   field: "value",
      //   title: "奖品名称"
      // },{
      //   type: "option",
      //   field: "value",
      //   title: "发货状态",
      //   options:[
      //     {title: "直属代理", value: true},
      //     {title: "一般代理", value: false}
      //   ]
      // }],
      search: [
        {
          type: "field",
          field: "userFullname",
          title: "姓名"
        },
        {
          type: "field",
          field: "userContactMobile",
          title: "联系方式"
        },
        {
          type: "field",
          field: "city",
          title: "邮寄地址"
        },
        {
          type: "field",
          field: "address",
          title: "详细地址"
        },
      ],
      columns: [
        {
          title: "用户昵称",
          dataIndex: "user.nickname",
          key: "user.nickname"
        },
        {
          title: "奖品名称",
          dataIndex: "classAwardRecord.classAward.name",
          key: "classAwardRecord.classAward.name"
        },
        {
          title: "奖品级别",
          dataIndex: "classAwardRecord.classAward.classLevelId",
          key: "classAwardRecord.classAward.classLevelId",
          render: text => <span> {this.getOneClassLevels(text)}</span>
        },
        {
          title: "中奖时间",
          dataIndex: "classAwardRecord.createdAt",
          key: "classAwardRecord.createdAt",
          type: "date"
        },
        {
          title: "邮寄地址",
          dataIndex: "city",
          key: "city",
          render: (text) => <span>{text ? text : '---'}</span>
        },
        {
          title: "详细地址",
          dataIndex: "address",
          key: "address",
          render: (text) => <span>{text ? text : '---'}</span>
        },
        {
          title: "姓名",
          dataIndex: "userFullname",
          key: "userFullname",
          render: (text) => <span>{text ? text : '---'}</span>
        },
        {
          title: "联系方式",
          dataIndex: "userContactMobile",
          key: "userContactMobile",
          render: (text) => <span>{text ? text : '---'}</span>
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
            {
              record.classAwardRecord &&
              record.classAwardRecord.classAward &&
              record.classAwardRecord.classAward.type === "METARIAL" &&
              record.hasAddress ? (
                record.fahuoed ? (
                  <div>
                    <span>已发货</span>
                    <Divider type="vertical"/>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.isShowDeliver(record)
                        
                      }}
                    >
                      物流信息
                    </a>
                    <Divider type="vertical"/>
                    <a
                      href="javascript:;"
                      onClick={() => {
                        this.setState({ curRow: record, visible: true });
                      }}
                    >
                      修改物流
                    </a>
                  </div>
                ) : (
                <div>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this.setState({curRow: record, visible: true});
                    }}
                  >
                    发货
                  </a>
                  <Divider type="vertical"/>
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this.setState({ curRow: record, show: true });
                    }}
                  >
                    物流信息
                  </a>
                </div>
                )
              ): '---'
            }
            </span>
          )
        }
      ]
    };

    return (
      <section>
        {/* <a download={'订单列表.xlsx'} href={`${configUrl.apiUrl}${configUrl.apiBasePath}/classAwardRecords/exportAwardRecord?filter=${JSON.stringify(filter)}&access_token=${localStorage.token}` || '#'}> */}
          <Button style={{marginBottom: '5px', marginLeft: '5px'}} onClick={() => {this.setState({ outputVisible: true })}}> 导出EXCEL </Button>
        {/* </a> */}
        <Grid fluid>
          <Row>
            <Col lg={12}>
              <TableExpand
                {...config}
                path={`${this.props.match.path}`}
                replace={this.props.replace}
                refresh={this.state.refreshTable}
                path={`${this.props.match.path}`}
                replace={this.props.replace}
                onRefreshEnd={() => {
                  this.setState({refreshTable: false});
                }}
              />
            </Col>
          </Row>
          <Modal
            visible={this.state.visible}
            title="发货信息"
            onCancel={() => {
              this.setState({visible: false});
            }}
            footer={null}
          >
            <FormExpand
              elements={[
                {
                  label: "物流公司",
                  field: "company",
                  type: "select",
                  options: [
                    {
                      title: "顺丰快递",
                      value: "shunfeng"
                    },
                    {
                      title: "圆通快递",
                      value: "yuantong"
                    },
                    {
                      title: "EMS快递",
                      value: "ems"
                    },
                    {
                      title: "中通快递",
                      value: "zhongtong"
                    },
                    {
                      title: "韵达快递",
                      value: "yunda"
                    }
                  ],
                  params: {
                    rules: [{required: true, message: "必填项"}]
                  }
                },
                {
                  type: "text",
                  field: "no",
                  label: "快递单号",
                  params: {
                    rules: [{required: true, message: "必填项"}]
                  }
                }
              ]}
              onSubmit={values => {
                this.submitNew(values);
              }}
              onCancel={() => {
                this.setState({visible: false});
              }}
            />
          </Modal>
          {/** 导出EXCEL */}
          <Modal
            visible={this.state.outputVisible}
            title="导出EXCEL"
            onCancel={() => {
              this.setState({outputVisible: false});
            }}
            footer={null}
          >
            <Form>
              <FormItem {...formItemLayout} label="时间">
                {getFieldDecorator(`time`, {
                  rules: [{message: '请选择时间范围', required: true}],
                  initialValue: null
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
              <FormItem {...formItemLayout} label="奖项">
                {getFieldDecorator(`award`, {
                  rules: [{message: '请选择奖项', required: true}],
                  initialValue: optionLevels && optionLevels[0] && optionLevels[0].value || []
                })(
                  <Select 
                    placeholder="请选择奖项"
                    notFoundContent="暂无数据"
                  >
                    {
                      optionLevels && optionLevels.length ? optionLevels.map((v, i) =>
                        <Option value={v.value} key={v.value}>{v.title}</Option>
                      ) : null
                    }
                  </Select>
                )}
              </FormItem>
              <div className="ta-c mt-20">
                <Button style={{ marginRight: 8 }} onClick={() => {
                  this.handleExcel('fail')
                }}>
                  取消
                </Button>
                {(function(){
                  
                  const name = getFieldValue('award')
                  const time = getFieldValue('time')
                  if(name && time) {
                    const start = moment(time).format('YYYY-MM-DD')

                    if(start) {
                      return <a download={'订单列表.xlsx'} href={`${configUrl.apiUrl}${configUrl.apiBasePath}/classAwardRecords/exportAwardRecord?name=${name}&start=${start}&end=${start}&access_token=${localStorage.token}` || '#'}>
                        <Button style={{marginBottom: '5px', marginLeft: '5px'}} type="primary" onClick={() => that.handleExcel('success')}>确定</Button>
                      </a>
                    }
                  } else {
                    return <Button style={{marginBottom: '5px', marginLeft: '5px'}} disabled={true} type="primary">确定</Button>
                  }
                }())}
                
              </div>
            </Form>
            
          </Modal>
          {/*更改物流*/}
          <Modal
            visible={this.state.show}
            title={`${ orderRecord && orderRecord.id || ''}-物流信息`}
            okText="确定"
            cancelText="取消"
            footer={null}
            // onOk={() => {
            //   getData && this.deliverCheck(getData.orderId);
            // }}
            onCancel={() => {
              this.setState({
                show: false,
                isOrderEdit: false,
              }, () => {
                // this.props.form.resetFields()
              });
            }}
          >
            {
              // orderRecord && orderRecord.expressNo ?
                <Form>
                  <FormItem {...formItemLayout} label="快递单号">
                    {getFieldDecorator(`deliverExpressNo`, {
                      rules: [{message: '请输入发货单号', required: isOrderEdit ? true : false}],
                      initialValue: getData && getData.no || ''
                    })(
                      <Input disabled={true}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="快递公司">
                    {getFieldDecorator(`deliverCompany`, {
                      rules: [{message: '请输入快递公司', required: isOrderEdit ? true : false}],
                      initialValue: getData && getData.company || ''
                    })(
                      <Select
                        disabled={true}
                        showSearch
                        placeholder="请选择快递公司"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {
                          deliverMsg && deliverMsg.length ? deliverMsg.map((v, i) =>
                            <Option value={v.value} key={v.value}>{v.name}</Option>
                          ) : null
                        }
                      </Select>
                    )}
                  </FormItem>
                </Form>
              // : null
            }
            {
              getData && getData.details && getData.details.length > 0 ?
                <Steps direction="vertical" size="small" current={0}>
                  {getData && getData.details && getData.details.length && getData.details.map((v,i)=>{
                    return(
                      <Step
                        className="stepDescription"
                        key={i}
                        title={
                          <div>
                            <div>{v.AcceptTime}</div>
                          </div>
                        }
                        status={getData.state === 4 && i === 0 ? 'finish' : i === 0 ? 'process' : 'wait'}
                        description={
                          <div>
                            <p>{v.AcceptStation}</p>
                            {/* <p>{v.opcode && v.opcode[0]}</p> */}
                          </div>
                        }
                      />
                    )
                  })}
                </Steps> :
              <div style={{width: '100%', margin: '40px auto', color: 'grey', textAlign: 'center'}}>暂无物流信息</div>
            }
          </Modal>
        </Grid>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const WinningListuuid = state => state.get("rts").get("uuid");
const getLogisticsDetail = state => state.get("rts").get("getLogisticsDetail");

const mapStateToProps = createStructuredSelector({
  WinningListuuid,
  getLogisticsDetail,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(WinningList));

