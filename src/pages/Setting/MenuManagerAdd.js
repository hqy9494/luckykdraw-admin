import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import {
  Row,
  Col,
  Panel,
  FormGroup,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import FormSubmit from "../../components/Form/FormSubmit";

export class MenuManagerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getOne();
  }

  componentWillReceiveProps(nextProps) {}

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

  dealOne = ones => {
    if (ones[0].id !== "one") {
      ones.unshift({ id: "one", name: "顶级菜单" });
    }
    return ones.map(o => {
      return {
        value: o.id,
        title: o.name
      };
    });
  };

  submitNew = (form = {}) => {
    if (Number(form.sort)) {
      this.props.rts(
        {
          method: "post",
          url: `/menus`,
          data: Object.assign(
            {},
            {
              name: form.name,
              eName: form.component,
              component: form.component,
              sort: form.sort
            },
            form.preMenuId !== "one" && { preMenuId: form.preMenuId }
          )
        },
        this.uuid,
        "submitNew",
        () => {
          this.props.to("/setting/menuManager");
        }
      );
    }
  };

  render() {
    const { oneLevel } = this.props;
    let ones = [];

    if (oneLevel && oneLevel[this.uuid]) {
      ones = this.dealOne(oneLevel[this.uuid]);
    }

    return (
      <Panel header="基本信息">
        <FormSubmit
          element={[
            {
              label: "名称",
              field: "name",
              type: "text"
            },
            {
              label: "路由/组件名称",
              field: "component",
              type: "text"
            },
            {
              label: "父级菜单",
              field: "preMenuId",
              type: "select",
              options: ones
            },
            {
              label: "排序",
              field: "sort",
              type: "text"
            }
          ]}
          onSubmit={this.submitNew}
        />
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleManageruuid = state => state.get("rts").get("uuid");
const oneLevel = state => state.get("rts").get("oneLevel");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid,
  oneLevel
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerAdd);
