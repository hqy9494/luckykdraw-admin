import React from "react";
import { Col, Row } from "react-bootstrap";
import { Icon } from "antd"

export class LongTopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title, content, icon, color} =  this.props;

    return (
      <div style={{marginBottom: 10}}>
        <div style={{margin: "0 0 5px 0px"}}>
          <Icon type={icon} style={{marginRight: 10, color: color}} />
          {title}
        </div>
        <div className="statistic-long-top-bar">
          <Row>
            {content && content.map((v,i) =>
              (
                <Col key={i} md={3} className="statistic-long-top-col">
                  <Col md={12}>
                    {v.value}
                  </Col>
                  <Col md={12}>
                    {v.key}
                  </Col>
                </Col>
              )
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default LongTopBar
