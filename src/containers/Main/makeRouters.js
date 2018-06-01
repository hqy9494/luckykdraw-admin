import React, {Component} from "react";
import createReactClass from "create-react-class";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";

import BaseConstructor from "./base";

import Indexs from "../Indexs/modules";
import Tenants from "../Tenants/modules";
import QrCodes from "../QrCodes/modules";
import Prizes from "../Prizes/modules";
import Balances from "../Balances/modules";
import Equipments from "../Equipments/modules";
import Setting from "../Settings/modules";
import Records from "../Records/modules";
import Settings from "../Settings/modules";

const modules = {
  Indexs,
  Tenants,
  QrCodes,
  Prizes,
  Balances,
  Equipments,
  Setting,
  Records,
  Settings
};

export function mapDispatchToProps(dispatch) {
  return {};
}

const mapStateToProps = createStructuredSelector({});

// 终节点组件路由 （若组件为配置数组，调用base方法）
const endPointComponent = (path, model, component, name = "") => {
  let module = modules[model][component];
  let router = createReactClass({
    render() {
      if (module.component && module.component.constructor === Array) {
        return (
          <Route
            key={path}
            path={path}
            component={BaseConstructor(module, name)}
          />
        );
      } else {
        return <Route key={path} path={path} component={module}/>;
      }
    }
  });
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

// 终节点redirect路由
const endPointRedirect = (path, redirect) => {
  let router = createReactClass({
    render() {
      return (
        <Route
          exact
          key={path}
          path={path}
          render={props => <Redirect to={redirect}/>}
        />
      );
    }
  });
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

// 读取配置，递归生成路由（需要组件引用为固定格式）
const fullRouters = (obj, path = "", module = null, superRouter = null) => {
  let innerRouter = [];

  if (superRouter) {
    if (superRouter.redirect) {
      innerRouter.push(
        <Route
          exact
          key={path}
          path={path}
          render={props => <Redirect to={superRouter.redirect}/>}
        />
      );
    } else if (superRouter.component) {
      innerRouter.push(
        <Route
          exact
          key={path}
          path={path}
          component={endPointComponent(
            path,
            superRouter.module || module,
            superRouter.component,
            superRouter.title
          )}
        />
      );
    }
  }

  for (let key in obj) {
    let nPath = path + obj[key].path;
    if (obj[key]["subs"]) {
      innerRouter.push(
        <Route
          key={nPath}
          path={nPath}
          component={fullRouters(
            obj[key]["subs"],
            nPath,
            obj[key]["module"] || module,
            obj[key]
          )}
        />
      );
    } else {
      if (obj[key].redirect) {
        innerRouter.push(
          <Route
            exact
            key={nPath}
            path={nPath}
            component={endPointRedirect(nPath, obj[key].redirect)}
          />
        );
      } else {
        innerRouter.push(
          <Route
            exact
            key={nPath}
            path={nPath}
            component={endPointComponent(
              nPath,
              obj[key]["module"] || module,
              obj[key]["component"],
              obj[key]["title"]
            )}
          />
        );
      }
    }
  }

  class router extends Component {
    render() {
      return <Switch>{innerRouter}</Switch>;
    }
  }

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

export default fullRouters;
