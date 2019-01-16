import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Select, Table, Pagination, DatePicker,Button } from "antd";
const { RangePicker} = DatePicker;
import { Input } from 'antd';
const Option = Select.Option;
const Search = Input.Search;

export class AwardRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      userFilter: {},
      dataList: [],
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getDoubleAwards();
  }

  componentWillReceiveProps(nextProps) {}

  getDoubleAwards = (filter = {},userFilter = {}) => {
    // filter = filter || {};
    console.log(filter,userFilter)
    this.props.rts(
      {
        method: "get",
        url: '/DoubleAwardRecords/getRecords',
        params: {
          filter,
          userFilter
        }
      },
      this.uuid,
      "getRecords",
      records => {
        this.setState({ dataList:records, filter ,userFilter });
        console.log(records)
      }
    );
    this.props.rts(
        {
        method: "get",
        url: '/DoubleAwardRecords/count',
      },
      this.uuid,
      "count",
      val => {
        this.setState({ count:val.count || 0 });
      }
    )
  };

//   cancelSendAward = (id) => {
//     this.props.rts(
//       {
//         method: "put",
//         url: `/BuyTimesAwardRecords`,
//         params: {
//           buyTimesAwardRecordId: id
//         }
//       },
//       this.uuid,
//       "cancel",
//       cancel => {
//         this.getRecords()
//       }
//     );
//   };
  getDate = (val) => {
    let startTime = moment(val[0]).format('YYYY-MM-DD') + " 00:00+08:00";
    let endTime = moment(val[1]).format('YYYY-MM-DD') + " 23:59+08:00";
    this.getDoubleAwards({where:{'createdAt':{between:[startTime,endTime]}}})
  }

  render() {
    const {dataList,count} = this.state
    let columns = [
        {
          title: "用户昵称",
          dataIndex: "user.nickname",
          key: "user.nickname",
          render: (text,record) => {
            return (record.user && record.user.nickname)?<span>{record.user.nickname}</span>:<span style={{color:"#aaa"}}>未设置</span>
          }
        },
        {
          title: "抽奖时间",
          dataIndex: "createdAt",
          key: "createdAt",
          render:(time)=>{
            return time? moment(time).format('YYYY-MM-DD HH:mm:ss') : "--";
          }
        },
        {
          title: "领取时间",
          dataIndex: "updateAt",
          key: "updateAt",
          render:(text,record)=>{
            return record.isHexiaoed? moment(text).format('YYYY-MM-DD') : "--";
          }
        },
        {
          title: "分享状态",
          dataIndex: "isDoubled",
          key: "isDoubled",
          render: (text,record) => {
            return  record.isDoubled?<span style={{color:"#green"}}>已分享</span> : <span style={{color:"#aaa"}}>未分享</span>
          }
        },
        {
          title: "领取状态",
          key: "isHexiaoed",
          render: (text,record) => {
            return record.isHexiaoed? "已领取" : "未领取";
          }
        },
        {
          title: "中奖金额",
          dataIndex: "value",
          key: "value",
        },
        {
          title: "领取金额",
          dataIndex: "awardRecord.value",
          key: "awardRecord.value",
          render: (text,record) => {
            return record.isHexiaoed? record.awardRecord.value : "--" 
          }
        },
      ]

    // let { records } = this.state;
    return (
      <Grid style={{background: 'white',padding: '10px'}} fluid>
        <Button
          type="primary"
          style={{ width: 70, float: "right", margin: 10 }}
          onClick={() => this.getDoubleAwards()} 
        >重置</Button>
        <Search
          placeholder="用户昵称"
          onSearch={value => this.getDoubleAwards({limit: 50},{where: {nickname: value}})}
          style={{ width: 200, float: "left", margin: 10 }}
          enterButton
        />
        <Select  style={{width: 200, float: "left", margin: 10}} placeholder="分享状态" onChange={value => this.getDoubleAwards({where:value==="true"?{isDoubled:true}:{or:[{isDoubled:false},{isDoubled:null}]}})}>
            <Option value="true">是</Option>
            <Option value="null">否</Option>
        </Select>
        <RangePicker
            placeholder={['抽奖时间（开始）','抽奖时间（结束）']}
            renderExtraFooter={() => 'extra footer'}
            style={{ width: 300, float: "left", margin: 10 }}
            onChange={value => this.getDate(value)}
        />
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table columns={columns} dataSource={dataList || []} pagination={false} rowKey="id"/>
              <Pagination className="pagination-statistic" defaultPageSize={10} onChange={(page) => {this.getDoubleAwards(Object.assign({}, this.state.filter))}} total={ this.state.dataList.length || 10 } />
            </div>
          </Col>
        </Row>
      </Grid>
    // <div>123</div>
    );
    
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const staff = state => state.get("rts").get("staff");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  staff
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardRecord);
