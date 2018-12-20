import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import moment from "moment";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import { Modal, Divider,Button } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";
import configDevUrl from '../../config/dev'
import configProdUrl from "../../config/prod"

const configUrl =  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? configProdUrl : configDevUrl

export class WinningList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getLevels()
  }

  componentWillReceiveProps(nextProps) {
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
    });
  }

  searchsToWhere = (searchs = []) => {
    const { search } = this.props;
    let where = {};

    searchs.map(s => {
      let curSearch = search.find(ss => s.f === ss.field);
      if (curSearch.type === 'field') {
        if (curSearch.like) {
          where[s.f] = { like: `%${s.v}%` };
        } else {
           where[s.f] = s.v;
        }
      } else if (curSearch.type === 'relevance') {
        where[s.f] = s.v.value;
      } else if (curSearch.type === 'option') {
        where[s.f] = s.v;
      } else if (curSearch.type === 'number') {
        if (s.v && s.v.constructor === Array) {
          if (s.v[0] && s.v[1]) {
            where[s.f] = { between: [s.v[0], s.v[1]] };
          } else if (s.v[0]) {
            where[s.f] = { gt: s.v[0] };
          } else if (s.v[1]) {
            where[s.f] = { lt: s.v[0] };
          }
        }
      } else if (curSearch.type === 'date') {
        if (s.v && s.v.constructor === Object) {
          if (s.v.s && s.v.e) {
            where[s.f] = {
              between: [s.v.s, s.v.e]
            };
          } else if (s.v.s) {
            where[s.f] = { gt: s.v.s };
          } else if (s.values.endDate) {
            where[s.f] = { lt: s.v.e };
          }
        }
      }
    });
    return where;
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
    }
  };

  render() {
    const {orderRecord, getData} = this.state
    const filter = Object.assign({}, { order: "createdAt DESC" })

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
        // {
        //   type: "relevance",
        //   field: "classAwardRecord.classAwardId",
        //   model: {
        //     name: "classAwardId",
        //     api: "/classAwards",
        //     field: "name"
        //   },
        //   title: "奖品名称"
        // },
        // {
        //   type: "relevance",
        //   field: "classAwardRecord.classAward.classLevelId",
        //   model: {
        //     name: "classLevelId",
        //     api: "/ClassLevels",
        //     field: "name"
        //   },
        //   title: "奖品级别"
        // },
        // {
        //   type: "field",
        //   field: "userFullname",
        //   title: "收货人名称"
        // },
        // {
        //   type: "field",
        //   field: "userContactMobile",
        //   title: "收货人电话"
        // }
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
                        this.setState({ curRow: record, show: true });
                      }}
                    >
                      物流信息
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
              ): '--'
            }
            </span>
          )
        }
      ]
    };

    return (
      <section>
        <a download={'订单列表.xlsx'} href={`${configUrl.apiUrl}${configUrl.apiBasePath}/classAwardRecords/exportAwardRecord?filter=${JSON.stringify(filter)}&access_token=${localStorage.token}` || '#'}>
          <Button style={{marginBottom: '5px', marginLeft: '5px'}}> 导出EXCEL </Button>
        </a>
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
            // loading={this.state.loading}
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
              orderRecord && orderRecord.expressNo ?
                <Form layout="vertical">
                  <FormItem {...formItemLayout} label="订单号：">
                    {( getFieldDecorator("deliverOrderId", {
                        rules: [{message: '必填项', required: isOrderEdit ? true : false}],
                        initialValue: getData && getData.orderId || ''
                      })(
                        <Input disabled={true}/>
                      )
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="请输入发货单号：">
                    {getFieldDecorator(`deliverExpressNo`, {
                      rules: [{message: '请输入发货单号', required: isOrderEdit ? true : false}],
                      initialValue: getData && getData.no || ''
                    })(
                      <Input disabled={true}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="请输入快递公司：">
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
                </Form> :
              null
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
                            <div>{v.operateTime && v.operateTime[0]}</div>
                          </div>
                        }
                        status={getData.state === 4 && i === 0 ? 'finish' : i === 0 ? 'process' : 'wait'}
                        description={
                          <div>
                            <p>{v.operateContent && v.operateContent[0]}</p>
                            <p>{v.opcode && v.opcode[0]}</p>
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

const mapStateToProps = createStructuredSelector({
  WinningListuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(WinningList);
