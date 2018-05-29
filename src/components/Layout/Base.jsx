import React from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Offsidebar from "./Offsidebar";
import Footer from "./Footer";

class Base extends React.Component {
  render() {
    const authenticated = Boolean(this.props.user);

    if (!authenticated) {
      return <div className="wrapper">{this.props.children}</div>;
    } else {
      return (
        <div className="wrapper">
          <Header />

          <Sidebar noSync />

          <Offsidebar />

          <section>{this.props.children}</section>

          {/* <Footer /> */}
        </div>
      );
    }
  }
}

export default Base;
