import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Popconfirm, Button, message } from "antd";
import TableExpand from "../../components/TableExpand";
import OutPutExcel from "../../components/OutPutExcel";
import FormExpand from "../../components/FormExpand";
import configDevUrl from '../../config/dev'
import configProdUrl from "../../config/prod"
import { getUrlParams } from "../../utils/utils"
import redbao from "../../assets/img/redbao.png"

const configUrl =  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? configProdUrl : configDevUrl

export class AwardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      typeList: [],
      levelList: [],
    };
    this.uuid = uuid.v1();
    this.time = null
  }

  componentWillMount() {
    this.time = setTimeout(() => {
      this.getType()
    }, 1001);
  }

  componentWillReceiveProps(nextProps) {}

  getType = () => {
    this.props.rts({
      method: "get",
      url: "/classAwards/getAwardTypes"
    },this.uuid, "getType", (v) => {
      this.setState({
        typeList: v
      })
    });
  };

  componentWillUnmount () {
    clearTimeout(this.time)
  }

  // searchsToWhere = (searchs = []) => {
  //   const { search } = this.props;
  //   let where = {};

  //   searchs.map(s => {
  //     let curSearch = search.find(ss => s.f === ss.field);
  //     if (curSearch.type === 'field') {
  //       if (curSearch.like) {
  //         where[s.f] = { like: `%${s.v}%` };
  //       } else {
  //          where[s.f] = s.v;
  //       }
  //     } else if (curSearch.type === 'relevance') {
  //       where[s.f] = s.v.value;
  //     } else if (curSearch.type === 'option') {
  //       where[s.f] = s.v;
  //     } else if (curSearch.type === 'number') {
  //       if (s.v && s.v.constructor === Array) {
  //         if (s.v[0] && s.v[1]) {
  //           where[s.f] = { between: [s.v[0], s.v[1]] };
  //         } else if (s.v[0]) {
  //           where[s.f] = { gt: s.v[0] };
  //         } else if (s.v[1]) {
  //           where[s.f] = { lt: s.v[1] };
  //         }
  //       }
  //     } else if (curSearch.type === 'date') {
  //       if (s.v && s.v.constructor === Object) {
  //         if (s.v.s && s.v.e) {
  //           where[s.f] = {
  //             between: [s.v.s, s.v.e]
  //           };
  //         } else if (s.v.s) {
  //           where[s.f] = { gt: s.v.s };
  //         } else if (s.values.endDate) {
  //           where[s.f] = { lt: s.v.e };
  //         }
  //       }
  //     }
  //   });
  //   return where;
  // };

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

    
    if(where) {
      where.enable = true
    }
    // where && where.enable = true

    where = Object.assign({}, {where: where}, {skip: search.skip})
  
    return where;
  };

  turnType = (type) => {
    if(!type) return ''
    
    const {typeList} = this.state;
    const typeName = typeList.filter(v => v.type == type)

    return typeName && typeName[0] && typeName[0].name || ''
  }

  handleEnable = (id, value) => {
    this.getClassAwards(id, !value)
  }

  getClassAwards = (id, value) => {
    this.props.rts({
      url: `/classAwards/${id}`,
      method: 'get',
    }, this.uuid, 'getClassAwards', (v) => {
      let params = v
      params.enable = value
      this.putClassAwards(id, params)
    })
  }

  putClassAwards = (id, params) => {
    this.props.rts({
      url: `/classAwards/${id}`,
      method: 'patch',
      data: params
    }, this.uuid, 'putClassAwards', () => {
      message.success('修改成功', 2, () => {
        window.location.reload()
      })
    })
  }

  handleEdit = (id) => {
    this.props.to(`${this.props.match.url}/detail/${id}`)
  }

  isDelete = (id) => {}

  getOneClassLevels = (id) => {
    if(!id) return ''

    let {levelList} = this.state
    levelList = levelList.filter(v => v.id === id)

    return levelList && levelList[0] && levelList[0].name || ''
  }

  render() {
    const { type } = this.props;
    const {outPut} = this.state;
    
    let typeList = [];

    const urlParams =  getUrlParams()
    
    const where = urlParams && urlParams.q && this.searchsToWhere(JSON.parse(decodeURIComponent(urlParams.q))) || {}
    const filter = Object.assign({}, {...where}, { include: "classLevel", order: "createdAt DESC" })
    
    if (type && type[this.uuid]) {
      typeList = type[this.uuid].map(t => {
        return {
          title: t.name,
          value: t.id
        };
      });
    }

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/classAwards",
        total: "/classAwards/count",
        include: "classLevel",
        where: {
          enable: true
        }
      },
      search: [{
        type: "field",
        field: "name",
        title: "奖品名称"
      },{
        type: "number",
        field: "price",
        title: "奖品价格"
      },{
        type: "field",
        field: "unit",
        title: "单位"
      },{
        type: "option",
        field: "type",
        title: "类型",
        options:[
          {title: "实物奖", value: 'METARIAL'},
          {title: "优惠券", value: 'COUPON'},
          {title: "红包", value: 'RED_PACKET'},
        ]
      }],
      columns: [
        {
          title: "奖品名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "奖品图片",
          dataIndex: "picture",
          key: "picture",
          render: (text, record) => <img src={record.type === 'RED_PACKET' ? redbao : text} alt="商品图片" height="80" />
        },
        {
          title: "奖品级别",
          dataIndex: "classLevel.name",
          key: "classLevel.name",
          render: text => <span> {text}</span>
        },
        {
          title: "价格",
          dataIndex: "price",
          key: "price",
          // render: text => <span> {isNaN(text) ? 0 : Number(text / 100).toFixed(2)}</span>
          render: text => <span> {text}</span>
        },
        {
          title: "成本",
          dataIndex: "cost",
          key: "cost",
          // render: text => <span> {isNaN(text) ? 0 : Number(text / 100).toFixed(2)}</span>
          render: text => <span> {text}</span>
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: text => <span> {this.turnType(text)}</span>
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit"
        },
        {
          title: "创建时间",
          type: 'date',
          dataIndex: "createdAt",
          key: "createdAt",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let boxStock = record.boxStock ? record.boxStock : {};
            return (
              <span>
                <Button type="primary" size="small" onClick={()=> this.handleEdit(record.id)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                  title={`是否${record.enable ? "禁用" : "开启"}${
                    record.name
                  }奖项设置`}
                  onConfirm={() => { this.handleEnable(record.id, record.enable) }}
                  okText="是"
                  cancelText="否"
                >
                  {
                    record.enable ? 
                    <Button style={{background: '#FF6699', color: '#fff'}} size="small">禁用</Button> :
                    <Button style={{background: '#FF6699', color: '#fff'}} size="small">开启</Button>
                  }
                </Popconfirm>
              </span>
            );
          }
        }
      ]
    };

    return (
      <section>
        <Button onClick={() => {this.props.to(`${this.props.match.url}/detail/add`)}} style={{marginBottom: '5px'}}>新建</Button>
        <a download={'订单列表.xlsx'} href={`${configUrl.apiUrl}${configUrl.apiBasePath}/classAwards/exportAward?filter=${JSON.stringify(filter)}&access_token=${localStorage.token}` || '#'}>
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
                onRefreshEnd={() => {
                  this.setState({ refreshTable: false });
                }}
              />
            </Col>
          </Row>
        </Grid>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const AwardListuuid = state => state.get("rts").get("uuid");
const getType = state => state.get("rts").get("getType");

const mapStateToProps = createStructuredSelector({
  AwardListuuid,
  getType
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AwardList);
