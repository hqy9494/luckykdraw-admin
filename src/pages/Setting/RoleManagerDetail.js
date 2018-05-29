import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import FormSubmit from "../../components/Form/FormSubmit";
import { Form, Select, Button, Input, Tree, Table, message } from "antd";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

message.config({
  top: 60
});

export class RoleManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getRoles();
      this.getRoleMenu();
      this.getRoleApi();
    }
    this.getAllMenu();
    this.getAllApi();
  }

  componentWillReceiveProps(nextProps) {}

  getRoles = () => {
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/roles`
      },
      this.uuid,
      "roles",
      roles => {
        let form = {};
        roles.map(r => {
          if (r.id == this.props.match.params.id) {
            form = r;
          }
        });
        this.setState({ form });
      }
    );
  };
  getRoleUser = (roleId = this.props.match.params.id) => {
    roleId &&
      this.props.rts(
        {
          method: "get",
          url: `/roleMenus/users/${roleId}`
        },
        this.uuid,
        "users"
      );
  };
  submitDesc = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.rts(
          {
            method: "put",
            url: `/roleMenus/role/${this.props.match.params.id}`,
            data: values
          },
          this.uuid,
          "submitDesc",
          result => {
            message.success("修改成功", 3, () => {
              this.getRoles();
            });
          }
        );
      }
    });
  };
  //菜单
  getAllMenu = () => {
    this.props.rts(
      {
        method: "get",
        url: `/menus/all`
      },
      this.uuid,
      "allMenu"
    );
  };
  getRoleMenu = (roleId = this.props.match.params.id) => {
    roleId &&
      this.props.rts(
        {
          method: "get",
          url: `/roleMenus/${roleId}`
        },
        this.uuid,
        "roleMenu",
        roleMenu => {
          let checkedKeys = [];
          roleMenu.map((rm, i) => {
            if (rm.children) {
              rm.children.map((rmc, j) => {
                checkedKeys.push(rmc.id);
              });
            }
          });
          this.setState({ menuCheckedKeys: checkedKeys });
        }
      );
  };
  onMenuCheck = checkedKeys => {
    this.setState({ menuCheckedKeys: checkedKeys });
  };
  submitMenu = () => {
    let { menuCheckedKeys = [] } = this.state;
    const { allMenu } = this.props;
    if (allMenu && allMenu[this.uuid]) {
      allMenu[this.uuid].map((am, i) => {
        if (am.children) {
          am.children.map(amc => {
            if (
              menuCheckedKeys.indexOf(amc.id) > -1 &&
              menuCheckedKeys.indexOf(am.id) === -1
            ) {
              menuCheckedKeys.push(am.id);
            }
          });
        }
      });
    }
    let menus = menuCheckedKeys.map(ck => {
      return { id: ck };
    });

    this.props.match.params.id &&
      this.props.rts(
        {
          method: "post",
          url: `/roleMenus`,
          data: {
            roleId: Number(this.props.match.params.id),
            menus
          }
        },
        this.uuid,
        "submitMenu",
        () => {
          message.success("修改成功", 3, () => {
            this.getRoleMenu();
          });
        }
      );
  };
  //接口
  getAllApi = () => {
    this.props.rts(
      {
        method: "get",
        url: `/Permissions/methods`
      },
      this.uuid,
      "allApi"
    );
  };
  getRoleApi = () => {
    if (this.props.params && this.props.params.name) {
      this.props.rts(
        {
          method: "get",
          url: `/Permissions/methods/${this.props.params.name}/allow`
        },
        this.uuid,
        "roleApi",
        roleApi => {
          let checkedKeys = [];
          roleApi.map((rm, i) => {
            if (rm.methods) {
              rm.methods.map((rmc, j) => {
                checkedKeys.push(`${rm.model}-${rmc.property}`);
              });
            }
          });
          this.setState({ apicheckedKeys: checkedKeys });
        }
      );
    }
  };
  onApiCheck = checkedKeys => {
    this.setState({ apicheckedKeys: checkedKeys });
  };
  submitApi = () => {
    const { allApi, roleApi } = this.props;
    let { apicheckedKeys = [] } = this.state;
    let models = allApi[this.uuid].map(ra => ra.model);
    let oldApi = [];
    roleApi[this.uuid].map(rm => {
      if (rm.methods) {
        rm.methods.map((rmc, j) => {
          oldApi.push(`${rm.model}-${rmc.property}`);
        });
      }
    });
    apicheckedKeys = apicheckedKeys.filter(cs => models.indexOf(cs) === -1);
    let acls = [];

    apicheckedKeys.map(cs => {
      acls.push({
        model: cs.split("-")[0],
        property: cs.split("-")[1],
        permission: "ALLOW"
      });
    });

    oldApi.map(oa => {
      if (apicheckedKeys.indexOf(oa) === -1) {
        acls.push({
          model: oa.split("-")[0],
          property: oa.split("-")[1],
          permission: "DENY"
        });
      }
    });

    this.props.params &&
      this.props.params.name &&
      this.props.rts(
        {
          method: "post",
          url: `/Permissions/set`,
          data: {
            roleName: this.props.params.name,
            acls
          }
        },
        this.uuid,
        "submitApi",
        () => {
          message.success("修改成功", 3, () => {      
            this.getRoleApi();
          });
        }
      );
  };
  dealApi = apis => {
    return apis.map(api => {
      let newMethods = [],
        newMethodNames = [];
      api.methods.map(ams => {
        if (newMethodNames.indexOf(`${api.model}-${ams.name}`) === -1) {
          newMethodNames.push(`${api.model}-${ams.name}`);
          newMethods.push(ams);
        } else {
        }
      });
      return {
        ...api,
        methods: newMethods
      };
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { form = {} } = this.state;
    const { allMenu, allApi, users } = this.props;
    let row_menu = [],
      row_api = [],
      row_users = [];
    if (allMenu && allMenu[this.uuid]) {
      row_menu = allMenu[this.uuid];
    }
    if (allApi && allApi[this.uuid]) {
      row_api = this.dealApi(allApi[this.uuid]);
    }
    if (users && users[this.uuid]) {
      row_users = users[this.uuid];
    }
    return (
      <Panel header="基本信息">
        <Form>
          <div style={{ maxWidth: 750 }}>
            <FormItem {...formItemLayout} label="名称">
              <span className="ant-form-text">{form.name}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator("description", {
                initialValue: form.description,
                rules: [{ required: true, message: "描述为必填项" }]
              })(<Input />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
              <ButtonGroup>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button>取消</Button>
              </ButtonGroup>
            </FormItem>
          </div>
        </Form>
        <Tabs id="tabID">
          <Tab eventKey={1} title="员工">
            <Table
              bordered
              columns={[
                {
                  title: "用户名",
                  dataIndex: "username",
                  key: "username",
                  width: 200
                },
                {
                  title: "昵称",
                  dataIndex: "nickname",
                  key: "nickname",
                  width: 200
                }
              ]}
              dataSource={row_users}
            />
          </Tab>
          <Tab eventKey={2} title="菜单管理">
            <Tree
              checkable
              defaultExpandAll
              autoExpandParent
              onCheck={this.onMenuCheck}
              checkedKeys={this.state.menuCheckedKeys}
            >
              {row_menu.map((r, i) => {
                if (r.children) {
                  return (
                    <TreeNode title={r.name} key={r.id}>
                      {r.children.map((rc, i) => (
                        <TreeNode title={rc.name} key={rc.id} />
                      ))}
                    </TreeNode>
                  );
                } else {
                  return <TreeNode title={r.name} key={r.id} />;
                }
              })}
            </Tree>
            <Button
              type="primary"
              style={{ margin: "15px 0" }}
              onClick={this.submitMenu}
            >
              保存
            </Button>
          </Tab>
          <Tab eventKey={3} title="接口管理">
            <Tree
              checkable
              autoExpandParent
              onCheck={this.onApiCheck}
              checkedKeys={this.state.apicheckedKeys}
            >
              {row_api.map((r, i) => {
                if (r.methods) {
                  return (
                    <TreeNode title={r.model} key={r.model}>
                      {r.methods.map((rc, j) => (
                        <TreeNode
                          title={rc.description}
                          key={`${r.model}-${rc.name}`}
                        />
                      ))}
                    </TreeNode>
                  );
                } else {
                  return <TreeNode title={r.model} key={r.model} />;
                }
              })}
            </Tree>
            <Button
              type="primary"
              style={{ margin: "15px 0" }}
              onClick={this.submitApi}
            >
              保存
            </Button>
          </Tab>
        </Tabs>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleManageruuid = state => state.get("rts").get("uuid");
const allMenu = state => state.get("rts").get("allMenu");
const allApi = state => state.get("rts").get("allApi");
const users = state => state.get("rts").get("users");
const roleApi = state => state.get("rts").get("roleApi");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid,
  allMenu,
  allApi,
  users,
  roleApi
});

const WrappedRoleManagerDetail = Form.create()(RoleManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedRoleManagerDetail
);
