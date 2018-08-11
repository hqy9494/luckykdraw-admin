import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import { makeSelectUser } from "services/Auth/selectors";
import Login from "../Login";
import fullRouters from "./makeRouters";
import routerConfig from "../../routers";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Base from "../../components/Layout/Base";

const listofPages = [];

export class Main extends React.Component {
  static propTypes = {
    user: PropTypes.object
  };

  static defaultProps = {
    user: null
  };

  render() {
    const { user, location } = this.props;

    return (
      <Base user={user}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute
            authenticate={user}
            component={fullRouters(routerConfig)}
          />
        </Switch>
      </Base>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {};
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser()
});

// Wrap the component to inject dispatch and state into it
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
