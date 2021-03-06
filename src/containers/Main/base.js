import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { makeSelectUser } from "services/Auth/selectors";
import { makeSelectClient } from "services/global/selectors";
import { rtsRequest } from "services/rts/actions";
import { authLogout } from "services/Auth/actions";
import { authClient } from "services/global/actions";
import { push, goBack, replace } from "react-router-redux";
import uuid from "uuid";
import { message, Spin } from "antd";

// 全局css
import "./style.scss";
// 图标字体必要css
import "./font_icon/iconfont.css";

import breadcrumb from "../../breadcrumb";

import modules from "../../pages/modules";
import BaseContent from "./Layout/BaseContent";
import ContentWrapper from "../../components/Layout/ContentWrapper";
import { parseParameter } from "../../utils/utils";

message.config({
  top: 90,
  duration: 10,
  maxCount: 3,
});

// 根据配置读取并拼接组件
const BaseConstructor = (config, title) => {
  class Base extends React.Component {
    static propTypes = {
      user: PropTypes.object
    };

    static defaultProps = {
      user: null
    };

    constructor(props) {
      super(props);
      this.state = this.getInitialState();
      this.breadcrumb = this.getBreadcrumb(breadcrumb);
    }

    componentWillReceiveProps(nextProps) {
      if (this.ifErr(this.props, nextProps)) {
        let error = nextProps.error;
        message.error(error[error.length - 1]);
      }
    }

    ifErr(props, nProps) {
      if (!props.error && nProps.error) {
        return true;
      } else if (
        props.error &&
        nProps.error &&
        props.errLen !== nProps.errLen
      ) {
        return true;
      } else {
        return false;
      }
    }

    // 根据config配置初始化base的state
    getInitialState = () => {
      let initialState = Object.assign(config.initialState, {
        dataUUID: uuid.v1()
      });
      config["component"].map(item => {
        Object.assign(initialState, item.setState);
      });
      return initialState;
    };

    // 根据路由生成面包屑
    getBreadcrumb = breadcrumb => {
      let arr = [];
      let cur = breadcrumb.filter(b => b.path === this.props.match.path)[0];

      const dg = curBre => {
        if (curBre) {
          arr.push(curBre);
          if (curBre.pid) {
            dg(breadcrumb.filter(b => b.id === curBre.pid)[0]);
          }
        }
      };

      dg(cur);
      arr.push(breadcrumb[0]);
      arr.reverse();
      return arr;
    };

    // 根据config配置传入base中state或props中对应属性到组件的props中
    setConfigProps = index => {
      let extraProps = {};
      config["component"][index].getState &&
        config["component"][index].getState.map(item => {
          extraProps[item] = this.state[item];
        });
      config["component"][index].getProps &&
        config["component"][index].getProps.map(item => {
          extraProps[item] = this.props[item];
        });
      config["component"][index].getMethodToProps &&
        config["component"][index].getMethodToProps.map(item => {
          extraProps[item] = this[item];
        });
      return extraProps;
    };

    // 传递到子组件中的修改父组件state的方法
    changeBaseState = newState => {
      this.setState(newState);
    };

    render() {
      const { spin, user } = this.props;
      let innerComponents = [];
      for (let i = 0; i < config.component.length; i++) {
        innerComponents.push(modules[config.component[i].module]);
      }
      return (
        <BaseContent>
          <ContentWrapper>
            <h3>
              <span className="mr">
                {config.initialState.title || "无标题"}
              </span>
              {config.initialState.subtitle && (
                <span className="text-sm hidden-xs">
                  {config.initialState.subtitle}
                </span>
              )}
              {config.initialState.breadcrumb &&
                this.breadcrumb &&
                this.breadcrumb.length > 0 && (
                  <ol className="breadcrumb">
                    {this.breadcrumb.map(bre => {
                      if (bre.path === this.props.match.path) {
                        return (
                          <li key={`breadcrumb-${bre.id}`} className="active">
                            {bre.title}
                          </li>
                        );
                      } else {
                        return (
                          <li key={`breadcrumb-${bre.id}`}>
                            <a
                              href="javascript:;"
                              onClick={() => {
                                this.props.to(bre.path);
                              }}
                            >
                              {bre.title}
                            </a>
                          </li>
                        );
                      }
                    })}
                  </ol>
                )}
            </h3>
            {innerComponents.map((item, index) => {
              return React.createElement(
                item,
                Object.assign(
                  {},
                  {
                    key: index,
                    user: this.props.user,
                    to: this.props.to,
                    replace: this.props.replace,
                    match: this.props.match,
                    info: config["component"][index]["info"],
                    changeBaseState: this.changeBaseState,
                    subTitle: this.state.subTitle,
                    params: parseParameter(),
                    goBack: this.props.goBack
                  },
                  this.setConfigProps(index)
                )
              );
            })}
          </ContentWrapper>
        </BaseContent>
      );
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      dispatch,
      to: path => dispatch(push(path)),
      goBack: () => dispatch(goBack()),
      replace: (path, search) => dispatch(replace({ pathname: path, search })),
      getMe: token => dispatch(authClient(token)),
      logout: () => dispatch(authLogout()),
      rts: (filter, uuid, field, cb, noSpin) =>
        dispatch(rtsRequest(filter, uuid, field, cb, noSpin))
    };
  };

  const error = state => state.get("rts").get("error");
  const spin = state => state.get("rts").get("spin");
  const errLen = state => state.get("rts").get("errLen");

  const mapStateToProps = createStructuredSelector({
    user: makeSelectUser(),
    client: makeSelectClient(),
    error,
    spin,
    errLen
  });

  return connect(mapStateToProps, mapDispatchToProps)(Base);
};

export default BaseConstructor;
