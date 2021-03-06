import React from "react";
import pubsub from "pubsub-js";
import HeaderRun from "./Header.run";
import {
  NavDropdown,
  MenuItem,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";
import { Router, Route, Link, History } from "react-router-dom";

// Necessary to create listGroup inside navigation items
class CustomListGroup extends React.Component {
  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

class Header extends React.Component {
  componentDidMount() {
    HeaderRun();
  }

  toggleUserblock(e) {
    e.preventDefault();
    pubsub.publish("toggleUserblock");
  }

  render() {
    const ddAlertTitle = (
      <span>
        <em className="icon-bell" />
        <span className="label label-danger">11</span>
      </span>
    );
    return (
      <header className="topnavbar-wrapper">
        {/* START Top Navbar */}
        <nav role="navigation" className="navbar topnavbar">
          {/* START navbar header */}
          <div className="navbar-header">
            <a href="#/" className="navbar-brand">
              <div className="brand-logo">
                {/* <img src="assets/img/logo.png" alt="App Logo" className="img-responsive" /> */}
                <span
                  style={{
                    fontSize: "30px",
                    color: "#fff",
                    lineHeight: "35px"
                  }}
                >
                  幸运抽奖
                </span>
              </div>
              <div className="brand-logo-collapsed">
                {/* <img src="assets/img/logo-single.png" alt="App Logo" className="img-responsive" /> */}
                <span
                  style={{
                    fontSize: "20px",
                    color: "#fff",
                    lineHeight: "35px"
                  }}
                >
                  幸运
                </span>
              </div>
            </a>
          </div>
          {/* END navbar header */}
          {/* START Nav wrapper */}
          <div className="nav-wrapper">
            {/* START Left navbar */}
            <ul className="nav navbar-nav">
              <li>
                {/* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
                <a
                  href="#"
                  data-trigger-resize=""
                  data-toggle-state="aside-collapsed"
                  className="hidden-xs"
                >
                  <em className="fa fa-navicon" />
                </a>
                {/* Button to show/hide the sidebar on mobile. Visible on mobile only. */}
                <a
                  href="#"
                  data-toggle-state="aside-toggled"
                  data-no-persist="true"
                  className="visible-xs sidebar-toggle"
                >
                  <em className="fa fa-navicon" />
                </a>
              </li>
              {/* START User avatar toggle */}
              <li>
                {/* Button used to collapse the left sidebar. Only visible on tablet and desktops */}
                <a
                  id="user-block-toggle"
                  href="#"
                  onClick={this.toggleUserblock}
                >
                  {/* <em className="icon-user" /> */}
                </a>
              </li>
              {/* END User avatar toggle */}
            </ul>
            {/* END Left navbar */}
            {/* START Right Navbar */}

            {/* END Right Navbar */}
          </div>
          {/* END Nav wrapper */}
          {/* START Search form */}
          <form role="search" action="search.html" className="navbar-form">
            <div className="form-group has-feedback">
              <input
                type="text"
                placeholder="Type and hit enter ..."
                className="form-control"
              />
              <div
                data-search-dismiss=""
                className="fa fa-times form-control-feedback"
              />
            </div>
            <button type="submit" className="hidden btn btn-default">
              Submit
            </button>
          </form>
          {/* END Search form */}
        </nav>
        {/* END Top Navbar */}
      </header>
    );
  }
}

export default Header;
