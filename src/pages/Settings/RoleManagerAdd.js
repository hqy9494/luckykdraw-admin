import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import { Form, Select, Button, Input, message } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class RoleManagerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props.rts(
        {
          method: "post",
          url: `/accounts/roles`,
          data: values
        },
        this.uuid,
        "submitNew",
        () => {
          this.props.to("/safety/roleManager");
        }
      );
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Panel header="基本信息">
        <Form onSubmit={this.submitNew}>
          <div style={{ maxWidth: 750 }}>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "用户名为必填项" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator("description", {
                rules: [{ required: true, message: "昵称为必填项" }]
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
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleManageruuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid
});

const WrappedRoleManagerAdd = Form.create()(RoleManagerAdd);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedRoleManagerAdd
);
