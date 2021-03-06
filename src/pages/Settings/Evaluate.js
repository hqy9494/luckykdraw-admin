import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Grid, Row, Panel } from "react-bootstrap";
import { Modal, Divider, Popconfirm, Select, Tabs,Input,Button ,Mention, Form,Table } from "antd";
import TableExpand from "../../components/TableExpand";
import FormExpand from "../../components/FormExpand";

const formItemLayout = {
  labelCol: {span: 4, offset: 6},
  wrapperCol: {span: 14, }
};
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const { toContentState, getMentions } = Mention;
const FormItem = Form.Item;
export class Evaluate extends React.Component {
  constructor(props) {
    super(props);
    let params = props.params;

    this.state = {
      visible: false,
      refreshTable: false,
      type: 1,
      selectTabKey: params.tab || "1",
      searchValue:"",
      searchDatas:[],
      isSearched:false,
     // initValue: toContentState('@afc163'),
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {}

  submitNew = values => {
    if (this.state.curRow && this.state.curRow.id) {
      this.props.rts(
        {
          method: "patch",
          url: `/awards/${this.state.curRow.id}`,
          data: values
        },
        this.uuid,
        "submitFix",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    } else {
      this.props.rts(
        {
          method: "post",
          url: `/awards`,
          data: values
        },
        this.uuid,
        "submitNew",
        () => {
          this.setState({ refreshTable: true, visible: false });
          window.location.reload();
        }
      );
    }
  };

  delete=(id)=>{
    this.props.rts(
      {
        method: "delete",
        url: `/posts/${id}`
      },
      this.uuid,
      "delete",
      () => {
        this.setState({ refreshTable: true });
        // window.location.reload();
      }
    );
  };

  banUser = (userId, enable) => {
    this.props.rts(
      {
        method: "post",
        url: `/accountBanInPosts/switch`,
        params: {
          userId: userId,
          enable: !enable
        }
      },
      this.uuid,
      "switch",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  setPostHot = (tid) => {
    this.props.rts(
      {
        method: "post",
        url: `/posts/setPostHot`,
        params: {
          tid
        }
      },
      this.uuid,
      "setPostHot",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };

  setPostLucky = (tid) => {
    this.props.rts(
      {
        method: "post",
        url: `/posts/setPostLucky`,
        params: {
          tid
        }
      },
      this.uuid,
      "setPostLucky",
      () => {
        this.setState({ refreshTable: true });
      }
    );
  };
  handleReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({
      refreshTable: true,
      searchDatas:[],
      isSearched:false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('请输入要查找的微信昵称');
        return;
      }

      this.props.rts(
        {
          method: "get",
          url: `/posts/getTopicsByNickname`,
          params: values

        },
        this.uuid,
        "getSearch",
        (v) => {
          this.setState({
            refreshTable: true,
            searchDatas:v,
              isSearched:true,
          },
            ()=>{
            console.log(this.state.searchDatas,"回调")
            }
            );
        }
      );
      console.log('Submit!!!');
      console.log(values);
    });
  }



  render() {
    const {searchValue,searchDatas,isSearched}=this.state;
    const { getFieldDecorator } = this.props.form;
console.log(searchDatas,"searchDatas")
console.log(isSearched,"isSearched")
    const config = {
      tab: 1,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/posts`,
        total: "/posts/count",
        filter: {type: 1}
      },
      search: [],
      columns: [
        {
            title: "图片",
            dataIndex: "images",
            key: "images",
            render: text => {
              return <div>
                {
                  text&&text.length>0?text.map((t,i)=> <img key={i} src={t} alt="商品图片" height="60" style={{float: "left", marginLeft: 10}} />):""
                }
              </div>
            }
        },
        {
            title: "内容",
            dataIndex: "title",
            key: "title",
            width: 500
        },
        {
            title: "微信昵称",
            dataIndex: "user.nickname",
            key: "user.nickname"
        },
        {
            title: "用户是否被禁",
            dataIndex: "ban",
            key: "ban",
            render: (v) => {
              return v ? (v.enable ? "否" : "是") : "否"
            }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let v = record.ban;
            let enable = v ? (v.enable ? true : false) : true;
            return <span>
              <Popconfirm title="确定删除此条晒单" onConfirm={()=>{this.delete(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  删除
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={enable ? "确定禁止该用户晒单" : "确定恢复该用户晒单"} onConfirm={()=>{this.banUser(record.user.id, enable)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {enable ? "禁止晒图" : "恢复晒图"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题热门"} onConfirm={()=>{this.setPostHot(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题热门"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题翻牌"} onConfirm={()=>{this.setPostLucky(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题翻牌"}
                </a>
              </Popconfirm>
            </span>
          }
        }
      ]
    };

    const config2 = {
      tab: 2,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/posts`,
        total: "/posts/count",
        filter: {type: 2}
      },
      search: [],
      columns: [
        {
          title: "图片",
          dataIndex: "images",
          key: "images",
          render: text => {
            return <div>
              {
                text&&text.length>0?text.map((t,i)=> <img key={i} src={t} alt="商品图片" height="60" style={{float: "left", marginLeft: 10}} />):""
              }
            </div>
          }
        },
        {
          title: "内容",
          dataIndex: "title",
          key: "title",
          width: 500
        },
        {
          title: "微信昵称",
          dataIndex: "user.nickname",
          key: "user.nickname"
        },
        {
          title: "用户是否被禁",
          dataIndex: "ban",
          key: "ban",
          render: (v) => {
            return v ? (v.enable ? "否" : "是") : "否"
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let v = record.ban;
            let enable = v ? (v.enable ? true : false) : true;
            return <span>
              <Popconfirm title="确定删除此条晒单" onConfirm={()=>{this.delete(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  删除
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={enable ? "确定禁止该用户晒单" : "确定恢复该用户晒单"} onConfirm={()=>{this.banUser(record.user.id, enable)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {enable ? "禁止晒图" : "恢复晒图"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题翻牌"} onConfirm={()=>{this.setPostLucky(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题翻牌"}
                </a>
              </Popconfirm>
            </span>
          }
        }
      ]
    };

    const config3 = {
      tab: 3,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/posts`,
        total: "/posts/count",
        filter: {type: 3}
      },
      search: [],
      columns: [
        {
          title: "图片",
          dataIndex: "images",
          key: "images",
          render: text => {
            return <div>
              {
                text&&text.length>0?text.map((t,i)=> <img key={i} src={t} alt="商品图片" height="60" style={{float: "left", marginLeft: 10}} />):""
              }
            </div>
          }
        },
        {
          title: "内容",
          dataIndex: "title",
          key: "title",
          width: 500
        },
        {
          title: "微信昵称",
          dataIndex: "user.nickname",
          key: "user.nickname"
        },
        {
          title: "用户是否被禁",
          dataIndex: "ban",
          key: "ban",
          render: (v) => {
            return v ? (v.enable ? "否" : "是") : "否"
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            let v = record.ban;
            let enable = v ? (v.enable ? true : false) : true;
            return <span>
              <Popconfirm title="确定删除此条晒单" onConfirm={()=>{this.delete(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  删除
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={enable ? "确定禁止该用户晒单" : "确定恢复该用户晒单"} onConfirm={()=>{this.banUser(record.user.id, enable)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {enable ? "禁止晒图" : "恢复晒图"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题热门"} onConfirm={()=>{this.setPostHot(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题热门"}
                </a>
              </Popconfirm>
            </span>
          }
        }
      ]
    };

    const configSearch = {
      tab: 1,
      api: searchDatas,
      search: [],
      columns: [
        {
          title: "图片",
          dataIndex: "images",
          key: "images",
          render: text => {
            return <div>
              {
                text&&text.length>0?text.map((t,i)=> <img key={i} src={t} alt="商品图片" height="60" style={{float: "left", marginLeft: 10}} />):""
              }
            </div>
          }
        },
        {
          title: "内容",
          dataIndex: "topic.title",
          key: "title",
          width: 500
        },
        {
          title: "微信昵称",
          dataIndex: "user.nickname",
          key: "user.nickname"
        },
        {
          title: "用户是否被禁",
          dataIndex: "ban",
          key: "ban",
          render: (v) => {
            return v ? (v.enable ? "否" : "是") : "否"
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => {
            console.log(record.tid,"record.tid")
            let v = record.ban;
            let enable = v ? (v.enable ? true : false) : true;
            return <span>
              <Popconfirm title="确定删除此条晒单" onConfirm={()=>{this.delete(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  删除
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={enable ? "确定禁止该用户晒单" : "确定恢复该用户晒单"} onConfirm={()=>{this.banUser(record.user.id, enable)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {enable ? "禁止晒图" : "恢复晒图"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题热门"} onConfirm={()=>{this.setPostHot(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题热门"}
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={"设置该主题翻牌"} onConfirm={()=>{this.setPostLucky(record.tid)}} okText="是" cancelText="否">
                <a href="javascript:;">
                  {"设置该主题翻牌"}
                </a>
              </Popconfirm>
            </span>
          }
        }
      ]
    };

    return (
      <Grid fluid>

        <Tabs defaultActiveKey="1" activeKey={this.state.selectTabKey} onChange={(activeKey) => {this.props.to(`/Evaluate?tab=${activeKey}`)}}>
          <TabPane tab="普通奖晒单" key="1">
            <div className="searchBox">
              <Form layout="horizontal"  className="searchForm">
                <FormItem label="微信昵称"
                         {...formItemLayout}
                >
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入搜索的微信昵称' }],
                  })(
                    <Input
                      placeholder={"请输入搜索的微信昵称"}
                    />
                  )}
                </FormItem>
                <FormItem className="searchButton"
                          //wrapperCol={{ span: 3, offset: 16 }}
                >
                  <Button type="primary" onClick={this.handleSubmit} style={{marginRight:"5px"}}>搜索</Button>
                  <Button onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Form>
            </div>
            <Row>
              <Col lg={12}>
                {isSearched?
                  <Panel>
                    <Table
                      columns={configSearch.columns}
                      dataSource={searchDatas}
                      size="middle"
                        {...configSearch}
                        path={`${this.props.match.path}`}
                        replace={this.props.replace}
                        refresh={this.state.refreshTable}
                        onRefreshEnd={() => {
                          this.setState({ refreshTable: false });
                        }}
                        defaultTab
                    />
                  </Panel>
                  :
                  <TableExpand
                    {...config}
                    path={`${this.props.match.path}`}
                    replace={this.props.replace}
                    refresh={this.state.refreshTable}
                    onRefreshEnd={() => {
                      this.setState({ refreshTable: false });
                    }}
                    defaultTab
                  />
                }
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="实物奖晒单" key="2">
            <div className="searchBox">
              <Form layout="horizontal"  className="searchForm">
                <FormItem label="微信昵称"
                          {...formItemLayout}
                >
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入搜索的微信昵称' }],
                  })(
                    <Input
                      placeholder={"请输入搜索的微信昵称"}
                    />
                  )}
                </FormItem>
                <FormItem className="searchButton"
                  //wrapperCol={{ span: 3, offset: 16 }}
                >
                  <Button type="primary" onClick={this.handleSubmit} style={{marginRight:"5px"}}>搜索</Button>
                  <Button onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Form>
            </div>
            <Row>
              <Col lg={12}>
                {isSearched ?
                  <Panel>
                    <Table
                      columns={configSearch.columns}
                      dataSource={searchDatas}
                      size="middle"
                      {...configSearch}
                      path={`${this.props.match.path}`}
                      replace={this.props.replace}
                      refresh={this.state.refreshTable}
                      onRefreshEnd={() => {
                        this.setState({refreshTable: false});
                      }}
                      defaultTab
                    />
                  </Panel>
                  :
                  <TableExpand
                    {...config2}
                    path={`${this.props.match.path}`}
                    replace={this.props.replace}
                    refresh={this.state.refreshTable}
                    onRefreshEnd={() => {
                      this.setState({refreshTable: false});
                    }}
                  />
                }
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="官方晒图" key="3">
            <div className="searchBox">
              <Form layout="horizontal"  className="searchForm">
                <FormItem label="微信昵称"
                          {...formItemLayout}
                >
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入搜索的微信昵称' }],
                  })(
                    <Input
                      placeholder={"请输入搜索的微信昵称"}
                    />
                  )}
                </FormItem>
                <FormItem className="searchButton"
                  //wrapperCol={{ span: 3, offset: 16 }}
                >
                  <Button type="primary" onClick={this.handleSubmit} style={{marginRight:"5px"}}>搜索</Button>
                  <Button onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Form>
            </div>
            <Row>
              <Col lg={12}>
                {isSearched ?
                  <Panel>
                    <Table
                      columns={configSearch.columns}
                      dataSource={searchDatas}
                      size="middle"
                      {...configSearch}
                      path={`${this.props.match.path}`}
                      replace={this.props.replace}
                      refresh={this.state.refreshTable}
                      onRefreshEnd={() => {
                        this.setState({refreshTable: false});
                      }}
                      defaultTab
                    />
                  </Panel>
                  :
                  <TableExpand
                    {...config3}
                    path={`${this.props.match.path}`}
                    replace={this.props.replace}
                    refresh={this.state.refreshTable}
                    onRefreshEnd={() => {
                      this.setState({refreshTable: false});
                    }}
                  />
                }
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <Modal
          visible={this.state.visible}
          title={`${this.state.curRow && this.state.curRow.user.nickname}的晒单` || "新建晒图"}
          onCancel={() => {
            this.setState({ visible: false });
            window.location.reload();
          }}
          footer={null}
        >
          <FormExpand
            elements={[
              {
                type: "picture",
                field: "mainImage",
                label: "图片",
                params: {
                  initialValue: this.state.curRow &&
                    this.state.curRow.images,
                  rules: [{ required: true, message: "必填项" }]
                },
                upload: "/api/files/upload"
              },
              {
                type: "text",
                field: "title",
                label: "内容",
                params: {
                  initialValue:
                    this.state.curRow && this.state.curRow.title
                }
              }
            ]}
            onSubmit={values => {
              this.submitNew(values);
            }}
            onCancel={() => {
              this.setState({ visible: false });
              window.location.reload();
            }}
          />
        </Modal>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const Evaluateuuid = state => state.get("rts").get("uuid")
const getSearch = state => state.get("rts").get("getSearch")

const mapStateToProps = createStructuredSelector({
  Evaluateuuid,
  getSearch
});
const FormEvaluate = Form.create()(Evaluate);
export default connect(mapStateToProps, mapDispatchToProps)(FormEvaluate);
