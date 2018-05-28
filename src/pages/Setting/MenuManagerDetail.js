import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import FormSubmit from "../../components/Form/FormSubmit";
import {
  Form,
  Select,
  Button,
  Input,
  InputNumber,
  Checkbox,
  message
} from "antd";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class MenuManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getMenu(this.props.match.params.id);
      this.getMenuRoles(this.props.match.params.id);
    }
    this.getOne();
    this.getRoles();
  }

  componentWillReceiveProps(nextProps) {}

  getMenu = id => {
    id &&
      this.props.rts(
        {
          method: "get",
          url: `/menus/${this.props.match.params.id}`
        },
        this.uuid,
        "menu"
      );
  };

  getMenuRoles = id => {
    id &&
      this.props.rts(
        {
          method: "get",
          url: `/roleMenus/menu/${id}`
        },
        this.uuid,
        "menuRoles",
        result => {
          this.setState({
            roles: result.map(r => {
              return r.id;
            })
          });
        }
      );
  };

  getOne = () => {
    this.props.rts(
      {
        method: "get",
        url: `/menus/oneLevel`
      },
      this.uuid,
      "oneLevel"
    );
  };

  getRoles = () => {
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/roles`
      },
      this.uuid,
      "roles"
    );
  };

  dealOne = ones => {
    if (ones[0].id !== "1") {
      ones.unshift({ id: "1", name: "顶级菜单" });
    }
    return ones.map(o => {
      return {
        value: o.id,
        title: o.name
      };
    });
  };

  submitinfo = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.rts(
          {
            method: "put",
            url: `/menus/${this.props.match.params.id}`,
            data: {
              name: values.name,
              component: values.component,
              preMenuId: values.preMenuId,
              sort: values.sort
            }
          },
          this.uuid,
          "submitinfo",
          result => {
            message.success("修改成功", 3, () => {
              this.getMenu(this.props.match.params.id);
            });
          }
        );
      }
    });
  };

  submitRoles = () => {
    const { roles = [] } = this.state;
    let success = [];
    roles.map(r => {
      this.props.rts(
        {
          method: "post",
          url: `/roleMenus`,
          data: {
            roleId: Number(r),
            menus: [{ id: this.props.match.params.id }]
          }
        },
        this.uuid,
        "menu",
        () => {
          success.push(r);
          if (success.length === roles.length) {
            message.success("修改成功", 3, () => {
              this.getMenuRoles(this.props.match.params.id);
            });
          }
        }
      );
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { oneLevel, menu, roles, menuRoles } = this.props;
    let ones = [],
      form = {},
      allRoles = [],
      curRoles = [];

    if (oneLevel && oneLevel[this.uuid]) {
      ones = this.dealOne(oneLevel[this.uuid]);
    }
    if (menu && menu[this.uuid]) {
      form = menu[this.uuid];
    }
    if (roles && roles[this.uuid]) {
      allRoles = roles[this.uuid].map(r => {
        return {
          label: r.description,
          value: r.id
        };
      });
    }
    // if (menuRoles && menuRoles[this.uuid]) {
    //   curRoles = menuRoles[this.uuid].map(r => {
    //     return r.id;
    //   });
    // }
    return (
      <Panel header="基本信息">
        <Form onSubmit={this.submitinfo}>
          <div style={{ maxWidth: 750 }}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator("name", {
                initialValue: form.name,
                rules: [{ required: true, message: "名称为必填项" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="路由/组件">
              {getFieldDecorator("component", {
                initialValue: form.component,
                rules: [{ required: true, message: "路由/组件为必填项" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="父级菜单">
              {getFieldDecorator("preMenuId", {
                initialValue: form.preMenuId,
                rules: [{ required: true, message: "父级菜单为必填项" }]
              })(
                <Select>
                  {ones.map(o => (
                    <Option key={o.value} value={o.value}>
                      {o.title}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator("sort", {
                initialValue: form.sort,
                rules: [{ required: true, message: "排序为必填项" }]
              })(<InputNumber />)}
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
          <Tab eventKey={1} title="可访问菜单角色">
            <FormItem>
              <CheckboxGroup
                options={allRoles}
                value={this.state.roles}
                onChange={values => {
                  this.setState({ roles: values });
                }}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.submitRoles}>
                保存
              </Button>
            </FormItem>
          </Tab>
        </Tabs>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const MenuManageruuid = state => state.get("rts").get("uuid");
const oneLevel = state => state.get("rts").get("oneLevel");
const menu = state => state.get("rts").get("menu");
const roles = state => state.get("rts").get("roles");
const menuRoles = state => state.get("rts").get("menuRoles");

const mapStateToProps = createStructuredSelector({
  MenuManageruuid,
  oneLevel,
  menu,
  roles,
  menuRoles
});

const WrappedMenuManagerDetail = Form.create()(MenuManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedMenuManagerDetail
);
