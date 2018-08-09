import React from "react";
import { Col, Row } from "antd";
import { Icon } from "antd"

export class LongTopBar2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title, content, icon, color, width } =  this.props;

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
                <Col key={i} span={6} style={{width: width, paddingTop: 10}} className="statistic-long-top-col">
                  <Col md={24} style={{color: v.value>0 ? "#fc0f3a" : "#6bd3ca"}}>
                    {v.value}%{v.value > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
                  </Col>
                  <Col md={24}>
                    {v.keyOne}
                  </Col>
                  <Col md={24}>
                    {v.keyTwo}
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

export default LongTopBar2
