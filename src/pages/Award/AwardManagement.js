import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row } from "react-bootstrap";
import { Modal, Divider, Button, Popconfirm, message } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

export class AwardManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      refreshTable: false,
      levelList: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getLevels();
  }

  componentWillReceiveProps(nextProps) {}

  getType = () => {
    this.props.rts(
      {
        method: "get",
        url: `/awards/types`
      },
      this.uuid,
      "type"
    );
  };

  putClassLevels = (id, params) => {
    this.props.rts({
      url: `/ClassLevels/${id}`,
      method: 'put',
      data: params
    }, this.uuid, 'putClassLevels', () => {
      message.success('修改成功', 2, () => {
        window.location.reload()
      })
    })
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

  getClassLevels = (id, value) => {
    this.props.rts({
      url: `/ClassLevels/${id}`,
      method: 'get',
    }, this.uuid, 'getClassLevels', (v) => {
      let params = v
      params.enable = value
      this.putClassLevels(id, params)
    })
  }

  getOneClassLevels = (id) => {
    let {levelList} = this.state
    levelList = levelList.filter(v => v.id === id)

    return levelList[0].name
  }

  handleEnable = (id, value) => {
    this.getClassLevels(id, !value)
  }

  handleBanner = (text) => {
    const bpStatus = {
      'ALL': '全屏爆屏',
      'BANNER': 'Banner爆屏',
      'SUBTITLE': '弹幕'
    }

    if(!Array.isArray(text)) return

    const rest = text.reduce((a, c) =>{
      return a + bpStatus[c] + '/'
    },'')
    
    if(rest === '') {
      return '---'
    }
    
    return rest.substring(0, rest.length-1)
  }
  
  handleEdit = (id) => this.props.to(`${this.props.match.url}/detail/${id}`)

  render() {
    
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/ClassLevels",
        total: "/ClassLevels/count"
      },
      search: [{
        type: "field",
        field: "name",
        title: "奖品级别",
      },{
        type: "option",
        field: "enable",
        title: "机制状态",
        options:[
          {title: "开启", value: true},
          {title: "禁用", value: false}
        ]
      }],
      columns: [
        {
          title: "奖品级别",
          dataIndex: "name",
          key: "name",
          // render: text => <img src={text} alt="商品图片" height="80" />
        },
        {
          title: "中奖机制",
          dataIndex: "base",
          key: "base",
          render: text => <span>{text}盒/轮</span>
        },
        {
          title: "机制状态",
          dataIndex: "enable",
          key: "enable",
          render: text => {
            if (text) {
              return "开启";
            } else {
              return "禁用";
            }
          }
        },
        {
          title: "爆屏状态",
          dataIndex: "bpStatus",
          key: "bpStatus",
          render: text => <span> {this.handleBanner(text)}</span>
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: 'date',
          sort: true
        },
        {
          title: "排序",
          dataIndex: "order",
          key: "order",
          sort: true
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
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
                  <Button style={{background: '#c9c9c9', color: '#fff'}} size="small">禁用</Button> :
                  <Button style={{background: '#FF6699', color: '#fff'}} size="small">开启</Button>
                 }
              </Popconfirm>
                <Divider type="vertical" />
              {/* <Popconfirm
                title={`确认删除${record.name || ''}奖品?`}
                onConfirm={() => { this.isDelete(record.id) }}
                okText="是"
                cancelText="否"
              >
                <Button type="danger" size="small">删除</Button>
              </Popconfirm> */}
            </span>
          )
        }
      ]
    };

    return (
      <section>
        <Button onClick={() => {this.props.to(`${this.props.match.url}/detail/add`)}} style={{marginBottom: '5px'}}>新建</Button>
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

const AwardManagementuuid = state => state.get("rts").get("uuid");
const getLevels = state => state.get("rts").get("getLevels");

const mapStateToProps = createStructuredSelector({
  AwardManagementuuid,
  getLevels
});

export default connect(mapStateToProps, mapDispatchToProps)(AwardManagement);
