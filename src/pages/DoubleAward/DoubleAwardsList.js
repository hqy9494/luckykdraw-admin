import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Select, Table, Pagination, DatePicker,Button } from "antd";
const { RangePicker} = DatePicker;
import { Input } from 'antd';
import locale from 'antd/lib/locale-provider/zh_CN';
const Option = Select.Option;
const Search = Input.Search;

export class DoubleAwardsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      filter: {},
      userFilter: {},
      dataList: [],
      pageSize: 10,
      page: 1,
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getDoubleAwards();
  }

  componentWillReceiveProps(nextProps) {}

  getDoubleAwards = (filter = {},userFilter = {},ini) => {
    // filter = filter || {};
    // console.log(filter,userFilter)
    this.props.rts(
      {
        method: "get",
        url: '/DoubleAwardRecords/getRecords',
        params: {
          filter,
          userFilter,
        }
      },
      this.uuid,
      "getRecords",
      records => {
        // this.setState({ dataList:records, filter ,userFilter });
          this.props.rts(
          {
            method: "get",
            url: '/DoubleAwardRecords/count',
            params: {
              where: filter.where||{},
            }
            
          },
          this.uuid,
          "count",
          val => {
            this.setState({ 
              count:userFilter.where?50:val.count,
              dataList:records,
              filter,
              userFilter,
              page: (filter.skip)/filter.limit+1 || 1,
              pageSize: filter.limit || 10,
            },()=>{
              // console.log(this.state)
            });
          }
        )
      }
    );
 
  };


  handlePageChange = (page,pageSize) => {    //当前页码变化
    // console.log(page,pageSize)
    this.getDoubleAwards(Object.assign({},this.state.filter,{limit: pageSize,skip: (page-1)*pageSize}),this.state.userFilter)

  }

  handleShowSizeChange = (page,pageSize) =>{
    this.getDoubleAwards(Object.assign({},this.state.filter,{limit: pageSize,skip:0}),this.state.userFilter)
  }

  
  handleSearchChange = (key,value) =>{
    if(value !== "") {
      let where = Object.assign({},this.state.userFilter.where||{},{[key]: value});
      this.getDoubleAwards(Object.assign({},this.state.filter,{limit: 50}),{where:where})
    } 
    else {
      if(this.state.userFilter.where){
        delete this.state.userFilter.where[key];
        if(JSON.stringify(this.state.userFilter.where) === "{}"){
          this.state.userFilter = {};
        }
        this.getDoubleAwards(Object.assign({},this.state.filter,{skip:0},{limit:10}),this.state.userFilter);
      }
    }
    
  }


  handleDateChange = (val) => {
    let where = {};
    if(val.length > 0){
      let startTime = moment(val[0]).format('YYYY-MM-DD') + " 00:00:00+08:00";
      let endTime = moment(val[1]).format('YYYY-MM-DD') + " 23:59:59+08:00";
      where = Object.assign({},this.state.filter.where || {},{createdAt:{between:[startTime,endTime]}})
    }else{
      delete this.state.filter.where.createdAt;
      where = this.state.filter.where;
    }
    
    let filter = Object.assign({},{skip:0},{limit:this.state.userFilter.where?50:10},{where:where})
    // console.log("f",filter)
    this.getDoubleAwards(filter,this.state.userFilter)
  }

  handleStatusChange = (value) => {
    let status = {where:{}};
    if(value==="true"){
      status = {isDoubled:true}
    }else if(value==="false"){
      status = {isDoubled:false}
    }else {
      status = {};
      if(this.state.filter.where){
        delete this.state.filter.where.isDoubled;
      }
    }
    
    let where = Object.assign({},this.state.filter.where || {},status)
    let filter = Object.assign({},{skip:0},{limit:this.state.userFilter.where?50:10},{where:where});
    this.getDoubleAwards(filter,this.state.userFilter)
  }

  render() {
    const {dataList,count,pageSize,page} = this.state
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
            if(record.isHexiaoed){
              return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }else{
              return "--"
            }
          }
        },
        {
          title: "分享状态",
          dataIndex: "isDoubled",
          key: "isDoubled",
          render: (text,record) => {
            // return <span>{record.isDoubled?'已分享':'未分享'}</span>
            if(record.isDoubled){
              return <span style={{color:"#3AD0B1"}}>已分享</span>
            }else{
              return <span style={{color:"#aaa"}}>未分享</span>
            }
          }
        },
        {
          title: "领取状态",
          key: "isHexiaoed",
          render: (text,record) => {
            if(record.isHexiaoed){
              return <span style={{color:"#23b7e5"}}>已领取</span>
            }else{
              return <span style={{color:"#f5222d"}}>未领取</span>
            }
          }
        },
        {
          title: "中奖金额",
          dataIndex: "value",
          key: "value",
        },
        {
          title: "领取金额",
          dataIndex: "awardRecord.prizeValue",
          key: "awardRecord.prizeValue",
          render: (text,record) => {
            if(record.isHexiaoed) {
              if(record.isDoubled) {
                return record.doublyValue;
              }else{
                return record.value;
              }
            }
            else {
              return  "--"
            }
          }
        },
      ]

    // let { records } = this.state;
    return (
      
      <Grid style={{background: 'white',padding: '10px'}} fluid>
        <Button
          type="primary"
          style={{ width: 70, float: "right", margin: 10 }}
          onClick={() => window.location.reload()} 
        >重置</Button>
        <Search
          placeholder="用户昵称"
          onSearch={value => this.handleSearchChange("nickname",value)}
          style={{ width: 200, float: "left", margin: 10 }}
          enterButton
          allowClear
        />
        <Select  style={{width: 200, float: "left", margin: 10}} placeholder="分享状态" onChange={value => this.handleStatusChange(value)}>
            <Option value="true">已分享</Option>
            <Option value="false">未分享</Option>
            <Option value="all">所有状态</Option>
        </Select>
        <RangePicker
            placeholder={['抽奖时间（开始）','抽奖时间（结束）']}
            renderExtraFooter={() => '点击两次选取时间范围'}
            style={{ width: 300, float: "left", margin: 10 }}
            onChange={value => this.handleDateChange(value)}
        />
        <Row>
          <Col lg={12}>
            <div className="statistic-box-with-title-bar" style={{width: "100%"}}>
              <Table 
                columns={columns} 
                dataSource={dataList || []} 
                pagination={false} 
                rowKey="id"
                pagination={{
                  pageSize:pageSize,
                  pageSizeOptions:['10','20','50','100'],
                  total: count,
                  showSizeChanger:true,
                  // onShowSizeChange:this.onSizeChange,
                  current:page,
                  onChange:this.handlePageChange,
                  onShowSizeChange:this.handleShowSizeChange,
                  showQuickJumper:true,
                  locale:locale.Pagination,
                  // showTotal:total =>`总计： ${total} 项`
                }}
                locale={{
                  filterTitle: '筛选',
                  filterConfirm: '确定',
                  filterReset: '重置',
                  emptyText: '暂无数据'
                }}
              />
            </div>
          </Col>
        </Row>
      </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoubleAwardsList);
