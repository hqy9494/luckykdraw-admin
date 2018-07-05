import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Card, Table, Icon } from "antd";
import moment from "moment";
import uuid from "uuid";
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Label } from "bizcharts";
// import styles from "./Index.scss";

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const columns1 = [
      {
        title: "排行",
        dataIndex: "a1",
        key: "a1"
      },
      {
        title: "名称",
        dataIndex: "a2",
        key: "a2"
      },
      {
        title: "性别",
        dataIndex: "a13",
        key: "a3"
      },
      {
        title: "累积购买盒数",
        dataIndex: "a4",
        key: "a4"
      }
    ];
    const columns2 = [
      {
        title: "排行",
        dataIndex: "a1",
        key: "a1"
      },
      {
        title: "名称",
        dataIndex: "a2",
        key: "a2"
      },
      {
        title: "当日派发量",
        dataIndex: "a13",
        key: "a3"
      },
      {
        title: "当日复购率",
        dataIndex: "a4",
        key: "a4"
      }
    ];

    const data1 = [];
    const data2 = [];

    const line1 = [
      { year: "1991", value: 15468 },
      { year: "1992", value: 16100 },
      { year: "1993", value: 15900 },
      { year: "1994", value: 17409 },
      { year: "1995", value: 17000 },
      { year: "1996", value: 31056 },
      { year: "1997", value: 31982 },
      { year: "1998", value: 32040 },
      { year: "1999", value: 33233 }
    ];
    const cols1 = {
      value: {
        min: 10000
      },
      year: {
        range: [0, 1]
      }
    };
    const line2 = [
      { country: "Asia", year: "1750", value: 502 },
      { country: "Asia", year: "1800", value: 635 },
      { country: "Asia", year: "1850", value: 809 },
      { country: "Asia", year: "1900", value: 5268 },
      { country: "Asia", year: "1950", value: 4400 },
      { country: "Asia", year: "1999", value: 3634 },
      { country: "Asia", year: "2050", value: 947 },
      { country: "Africa", year: "1750", value: 106 },
      { country: "Africa", year: "1800", value: 107 },
      { country: "Africa", year: "1850", value: 111 },
      { country: "Africa", year: "1900", value: 1766 },
      { country: "Africa", year: "1950", value: 221 },
      { country: "Africa", year: "1999", value: 767 },
      { country: "Africa", year: "2050", value: 133 }
    ];
    const cols2 = {
      year: {
        type: "linear",
        tickInterval: 50
      }
    };
    let line3 = [
      { action: "1次购买", pv: 50000 },
      { action: "2次购买", pv: 35000 },
      { action: "3-5次购买", pv: 25000 },
      { action: "5次以上", pv: 15000 }
    ];
    const cols3 = {
      percent: {
        nice: false
      }
    };

    return (
      <section className="index-page">
        <Row gutter={{ sm: 0, md: 20 }}>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon1" />
              <div>
                <span className="index-item1-label">微信关注总人数</span>
                <span className="index-item1-value">10086</span>
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon2" />
              <div>
                <span className="index-item1-label">现奖池总额</span>
                <span className="index-item1-value">10010</span>
              </div>
            </div>
          </Col>
          <Col sm={24} md={8}>
            <div className="index-item1">
              <div className="index-item1-icon index-item1-icon3" />
              <div>
                <span className="index-item1-label">累积奖池金额</span>
                <span className="index-item1-value">10086</span>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={16}>
            <Card
              title="奖池总额"
              style={{
                height: 535,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <Chart height={490} data={line1} scale={cols1} forceFit>
                <Axis name="year" />
                <Axis
                  name="value"
                  label={{
                    formatter: val => {
                      return (val / 10000).toFixed(1) + "k";
                    }
                  }}
                />
                <Tooltip crosshairs={{ type: "line" }} />
                <Geom type="area" position="year*value" />
                <Geom type="line" position="year*value" size={2} />
              </Chart>
            </Card>
          </Col>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="今日新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较昨天</span>
                        <span className="index-i3item-percent index-i3item-percent_up">
                          <Icon type="arrow-up" />10%
                        </span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较昨天</span>
                        <span className="index-i3item-percent index-i3item-percent_down">
                          <Icon type="arrow-down" />10%
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="本周新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上周</span>
                        <span className="index-i3item-percent index-i3item-percent_up">
                          <Icon type="arrow-up" />10%
                        </span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上周</span>
                        <span className="index-i3item-percent index-i3item-percent_down">
                          <Icon type="arrow-down" />10%
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="本月新增奖池数据"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">收</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上月</span>
                        <span className="index-i3item-percent index-i3item-percent_up">
                          <Icon type="arrow-up" />10%
                        </span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">派</span>
                      <span className="index-i3i-value">￥6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>较上月</span>
                        <span className="index-i3item-percent index-i3item-percent_down">
                          <Icon type="arrow-down" />10%
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={12}>
            <Card
              title="购买人数性别分布"
              style={{
                height: 263,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <div className="index-item4">
                <div className="index-i4-row1">
                  <span className="index-i4-icon1" />
                  <span className="index-i4-icon2" />
                </div>
                <div className="index-i4-row2">
                  <span
                    className="index-i4-percent1"
                    style={{ width: "40%" }}
                  />
                  <span
                    className="index-i4-percent2"
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="index-i4-row3">
                  <span className="index-i4-value1">120人（40%）</span>
                  <span className="index-i4-value1">180人（60%）</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col sm={24} md={12}>
            <Card
              title="复购率"
              style={{
                height: 263,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ width: "60%", display: "inline-block" }}>
                  <Chart
                    height={196}
                    data={line3}
                    scale={cols3}
                    padding={{
                      top: "auto",
                      right: 100,
                      bottom: 20,
                      left: "auto"
                    }}
                    forceFit
                  >
                    <Tooltip />
                    <Coord type="rect" transpose scale={[1, -1]} />
                    <Geom
                      type="intervalSymmetric"
                      position="action*pv"
                      shape="pyramid"
                      color={[
                        "action",
                        ["#0050B3", "#1890FF", "#40A9FF", "#69C0FF", "#BAE7FF"]
                      ]}
                    >
                      <Label
                        content={[
                          "action*pv",
                          (action, pv) => {
                            return action + " " + pv;
                          }
                        ]}
                        offset={35}
                        labeLine={{
                          lineWidth: 1,
                          stroke: "rgba(0, 0, 0, 0.15)"
                        }}
                      />
                    </Geom>
                  </Chart>
                </div>
                <div style={{ width: "40%", display: "inline-block" }}>
                  <div className="index-item5">
                    <div className="index-i5-count">总人数678人（50%）</div>
                    <div className="index-i5-value">
                      <span className="index-i5-value1">300人</span>
                      <span className="index-i5-value2">200人</span>
                    </div>
                  </div>
                  <div className="index-item5">
                    <div className="index-i5-count">总人数678人（50%）</div>
                    <div className="index-i5-value">
                      <span className="index-i5-value1">300人</span>
                      <span className="index-i5-value2">200人</span>
                    </div>
                  </div>
                  <div className="index-item5">
                    <div className="index-i5-count">总人数678人（50%）</div>
                    <div className="index-i5-value">
                      <span className="index-i5-value1">300人</span>
                      <span className="index-i5-value2">200人</span>
                    </div>
                  </div>
                  <div className="index-item5">
                    <div className="index-i5-count">总人数678人（50%）</div>
                    <div className="index-i5-value">
                      <span className="index-i5-value1">300人</span>
                      <span className="index-i5-value2">200人</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={16}>
            <Card
              title="奖池总额"
              style={{
                height: 535,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <Chart height={490} data={line2} scale={cols2} forceFit>
                <Axis name="year" />
                <Axis name="value" />
                <Legend />
                <Tooltip crosshairs={{ type: "line" }} />
                <Geom type="area" position="year*value" color="country" />
                <Geom
                  type="line"
                  position="year*value"
                  size={2}
                  color="country"
                />
              </Chart>
            </Card>
          </Col>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="扫码关注"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">注</span>
                      <span className="index-i3i-value">6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>扫码关注</span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">未</span>
                      <span className="index-i3i-value">6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>扫码未关注</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="取消关注"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item3">
                    <div className="index-i3-item index-i3-item_left">
                      <span className="index-i3i-icon">净</span>
                      <span className="index-i3i-value">6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>净关注数</span>
                      </span>
                    </div>
                    <div className="index-i3-item index-i3-item_right">
                      <span className="index-i3i-icon">消</span>
                      <span className="index-i3i-value">6,600</span>
                      <span className="index-i3i-change">
                        <span style={{ color: "#333" }}>取消关注数</span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="购买人数性别分布"
                  style={{
                    height: 165,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <div className="index-item4 small">
                    <div className="index-i4-row1">
                      <span className="index-i4-icon1" />
                      <span className="index-i4-icon2" />
                    </div>
                    <div className="index-i4-row2">
                      <span
                        className="index-i4-percent1"
                        style={{ width: "40%" }}
                      />
                      <span
                        className="index-i4-percent2"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <div className="index-i4-row3">
                      <span className="index-i4-value1">120人（40%）</span>
                      <span className="index-i4-value1">180人（60%）</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={{ sm: 0, md: 20 }} style={{ marginTop: 20 }}>
          <Col sm={24} md={8}>
            <Row>
              <Col md={24}>
                <Card
                  title="今日新老用户对比分布"
                  style={{
                    height: 360,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)",
                    marginBottom: 20
                  }}
                >
                  <div className="index-item4">
                    <div className="index-i4-row1">
                      <span className="index-i8-icon1" />
                      <span className="index-i8-icon2" />
                    </div>
                    <div className="index-i4-row2">
                      <span
                        className="index-i8-percent1"
                        style={{ width: "40%" }}
                      />
                      <span
                        className="index-i8-percent2"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <div className="index-i4-row3">
                      <span className="index-i8-value1">120人（40%）</span>
                      <span className="index-i8-value1">180人（60%）</span>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={24}>
                <Card
                  title="用户累积购买排行"
                  style={{
                    height: 340,
                    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
                  }}
                >
                  <Table
                    size="small"
                    locale={{ emptyText: "暂无数据" }}
                    columns={columns1}
                    dataSource={data1}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col sm={24} md={16}>
            <Card
              title="用户累积购买排行"
              style={{
                height: 720,
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.16)"
              }}
            >
              <Table
                size="small"
                locale={{ emptyText: "暂无数据" }}
                columns={columns2}
                dataSource={data2}
              />
            </Card>
          </Col>
        </Row>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const indexuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  indexuuid
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
