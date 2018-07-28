import React from "react";
import { Col, Row } from "antd";

export class BuyerStatisticBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {content} =  this.props;

    return (
      <div className="statistic-box-with-title-bar">
        <div className="title">
          购买用户情况
        </div>
        <div style={{height: 230, marginTop: 30}}>
          <Row style={{fontSize: 16}}>
            <Col span={11} style={{paddingLeft: 20}}>
              今日购买用户数(人)
            </Col>
            <Col span={3} style={{paddingRight: 10, textAlign: "right"}}>
              {content.dayBuyerCount}
            </Col>
            <Col  span={2} className="line">
            </Col>
            <Col  span={6} style={{paddingLeft: 10}}>
              人均购买盒数
            </Col>
            <Col span={2}>
              {content.daySaleCount === 0 ? 0 : parseFloat(content.daySaleCount/content.dayBuyerCount).toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Col span={2} className="pline0">
            </Col>
            <Col span={1} className="pline1">
            </Col>
            <Col  span={8} className="text-bottom-div" style={{paddingLeft: 10}}>
              已关注购买用户(人)
            </Col>
            <Col  span={3} style={{paddingRight: 10, textAlign: "right"}} className="text-bottom-div">
              {content.followedScanCount}
            </Col>
            <Col  span={2} className="line2">
            </Col>
            <Col  span={6} style={{paddingLeft: 10}} className="text-bottom-div">
              人均购买盒数
            </Col>
            <Col span={2} className="text-bottom-div">
              {content.followDaySaleCount === 0 ? 0 : parseFloat(content.followDaySaleCount/content.followedScanCount).toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Col span={2} className="pline2">
            </Col>
            <Col span={1} className="pline1">
            </Col>
            <Col  span={8} className="text-bottom-div" style={{paddingLeft: 10}}>
              未关注购买用户(人)
            </Col>
            <Col  span={3} style={{paddingRight: 10, textAlign: "right"}} className="text-bottom-div">
              {content.unfollowedScanCount}
            </Col>
            <Col  span={2} className="line2">
            </Col>
            <Col  span={6} style={{paddingLeft: 10}} className="text-bottom-div">
              人均购买盒数
            </Col>
            <Col span={2} className="text-bottom-div">
              {content.unFollowDaySaleCount === 0 ? 0 : parseFloat(content.unFollowDaySaleCount/content.unfollowedScanCount).toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Col span={5} className="pline0">
            </Col>
            <Col span={4} className="pline1">
            </Col>
            <Col  span={8} className="text-bottom-div" style={{paddingLeft: 10}}>
              扫码关注用户(人)
            </Col>
            <Col  span={4}>
            </Col>
            <Col span={3} className="text-bottom-div">
              {content.unFollowedScanCount}
            </Col>
          </Row>
          <Row>
            <Col span={5} className="pline2">
            </Col>
            <Col span={4} className="pline1">
            </Col>
            <Col  span={8} className="text-bottom-div" style={{paddingLeft: 10}}>
              扫码未关注用户(人)
            </Col>
            <Col  span={4}>
            </Col>
            <Col span={3} className="text-bottom-div">
              {content.buyAndUnFollowedScanCount}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default BuyerStatisticBox
