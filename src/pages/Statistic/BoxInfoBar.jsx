import React from "react";
import { Col, Row, Icon } from "antd";

export class BoxInfoBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { title, content, icon, color } =  this.props;

    return (
      <div style={{marginBottom: 10}}>
        <div style={{margin: "0 0 5px 0px"}}>
          <Icon type={icon} style={{marginRight: 10, color: color}} />
          {title}
        </div>
        <div>
          <Row gutter={30}>
            {content && content.map((v,i) =>
              (
                <Col key={i} span={6}>
                  <div className="statistic-box-info-bar" style={{background: v.background}}>
                    <Col span={24} style={{fontSize: 25}}>
                      {v.value}
                    </Col>
                    <Col span={24} style={{fontSize: 15}}>
                      {v.key}
                    </Col>
                  </div>
                </Col>
              )
            )}
          </Row>
        </div>
      </div>
    );
  }
}

export default BoxInfoBar
