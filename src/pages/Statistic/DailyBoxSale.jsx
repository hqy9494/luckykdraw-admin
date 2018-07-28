import React from "react";
import { Col, Row } from "antd";

export class DailyBoxSale extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content} =  this.props;
    let data = [{
      key: "今日设备平均销售额",
      value: content.dailySaleAverage,
      unit: "¥",
      color: "#699bfc"
    }, {
      key: "今日设备平均派出金额",
      value: content.dailySendAverage,
      unit: "¥",
      color: "#fecb6e"
    }, {
      key: "今日设备平均购买盒数",
      value: content.dailyBoxAverage,
      unit: "盒",
      color: "#999999"
    }, {
      key: "今日设备平均关注人数",
      value: content.dailyUserAverage,
      unit: "人",
      color: "#0f69c9"
    }];

    return (
      <div className="statistic-box-with-title-bar" style={{width: "30%", height: 450, fontSize: "18px"}}>
        {data && data.map((v, i) => {
          return (
            <div key={i} style={{height: 100}}>
              <Col span={4}>
                <div className="statistic-box-color-block" style={{backgroundColor: v.color}}>
                </div>
              </Col>
              <Col span={20} style={{height: 50, lineHeight: "50px"}}>
                {v.key}
              </Col>
              <Col span={4}>

              </Col>
              <Col span={20} style={{height: 50, lineHeight: "50px"}}>
                {v.unit}　　<span style={{fontSize: 28}}>{v.value}</span>
              </Col>
            </div>
          )
        })}
      </div>
    );
  }
}

export default DailyBoxSale
