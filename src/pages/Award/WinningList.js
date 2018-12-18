import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import moment from "moment";
import uuid from "uuid";
import {Col, Grid, Row} from "react-bootstrap";
import { Modal, Divider } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

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
  }

  componentWillReceiveProps(nextProps) {
  }

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/taobaocoupons/${this.state.curRow.id}`,
          data: {
            ...values,
            startTime: values.startTime[0].toDate(),
            endTime: values.startTime[1].toDate()
          }
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({refreshTable: true, visible: false});
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/taobaocoupons`,
          data: {
            ...values,
            startTime: values.startTime[0].toDate(),
            endTime: values.startTime[1].toDate()
          }
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({refreshTable: true, visible: false});
          window.location.reload();
        }
      );
    }
  };

  render() {
    const {orderRecord, getData} = this.state

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/classAwardRecords/getAwardRecords",
        total: "/classAwardRecords/getCount"
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
        // {
        //   title: "奖品级别",
        //   dataIndex: "classAwardRecord.classAward.classLevelId",
        //   key: "classAwardRecord.classAward.classLevelId"
        // },
        {
          title: "中奖时间",
          dataIndex: "classAwardRecord.createdAt",
          key: "classAwardRecord.createdAt",
          type: "date"
        },
        {
          title: "寄邮地址",
          dataIndex: "address",
          key: "address",
          render: (text) => <span>{text ? '---' : text}</span>
        },
        {
          title: "姓名",
          dataIndex: "userFullname",
          key: "userFullname",
          render: (text) => <span>{text ? '---' : text}</span>
        },
        {
          title: "联系方式",
          dataIndex: "user.mobile",
          key: "user.mobile",
          render: (text) => <span>{text ? '---' : text}</span>
        },
        // {
        //   title: "操作",
        //   key: "handle",
        //   render: (text, record) => (
        //     <span>
        //       <a
        //         href="javascript:;"
        //         onClick={() => {
        //           this.setState({ curRow: record, visible: true });
        //         }}
        //       >
        //         发货
        //       </a>
        //       <Divider type="vertical"/>
        //       <a
        //         href="javascript:;"
        //         onClick={() => {
        //           this.setState({ curRow: record, visible: true });
        //         }}
        //       >
        //         物流信息
        //       </a>
        //     </span>
        //   )
        // }
      ]
    };

    return (
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
        {/*更改物流*/}
        {/* <Modal
          visible={this.state.show}
          title={`${ orderRecord && orderRecord.id || ''}-物流信息`}
          okText="确定"
          cancelText="取消"
          footer={null}
          // onOk={() => {
          //   getData && this.deliverCheck(getData.orderId);
          // }}
          loading={this.state.loading}
          onCancel={() => {
            this.setState({
              show: false,
              isOrderEdit: false,
            }, () => {
              this.props.form.resetFields()
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
        </Modal> */}
      </Grid>
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
